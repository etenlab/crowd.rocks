import { Injectable } from '@nestjs/common';

import { PostgresService } from './postgres.service';

import { ErrorType } from 'src/common/types';
import { SiteTextsService } from 'src/components/site-text/site-texts.service';
import { SiteTextTranslationsService } from 'src/components/site-text/site-text-translations.service';

import { siteText } from './data/lang_sample_1';

import { getAdminTokenSQL } from './sql-string';
import {
  SiteTextPhraseDefinition,
  SiteTextWordDefinition,
} from 'src/components/site-text/types';

@Injectable()
export class DataLoadService {
  constructor(
    private pg: PostgresService,
    private siteTextService: SiteTextsService,
    private siteTextTranslationService: SiteTextTranslationsService,
  ) {
    // this.loadSiteTextData(); // I use this to easily rerun the load function
  }

  async loadSiteTextData() {
    console.log('loading site text data');

    const token = await this.getAdminToken();

    if (token == null) {
      console.error("Admin user hasn't been created yet");
      return;
    }

    console.log(`Admin token ${token}`);

    for (const [siteTextlike_string, translationObj] of Object.entries(
      siteText,
    )) {
      const { site_text_definition, error } = await this.siteTextService.upsert(
        {
          siteTextlike_string,
          definitionlike_string: 'Site User Interface Text',
          language_code: 'en',
          dialect_code: null,
          geo_code: null,
        },
        token,
      );

      if (error !== ErrorType.NoError) {
        console.log(
          `creating site text got error: ${error}`,
          `params: siteTextlike_string: ${siteTextlike_string}`,
        );
        continue;
      }

      const from_type_is_word = (site_text_definition as any)?.word_definition
        ? true
        : false;
      const from_definition_id = from_type_is_word
        ? (site_text_definition as SiteTextWordDefinition).word_definition
            .word_definition_id
        : (site_text_definition as SiteTextPhraseDefinition).phrase_definition
            .phrase_definition_id;

      for (const [langTag, translationlike_string] of Object.entries(
        translationObj,
      )) {
        const { error } =
          await this.siteTextTranslationService.upsertFromTranslationlikeString(
            {
              from_type_is_word,
              from_definition_id,
            },
            {
              translationlike_string: translationlike_string.trim(),
              definitionlike_string: 'Site User Interface Text Translation',
              language_code: langTag,
              dialect_code: null,
              geo_code: null,
            },
            token,
          );

        if (error !== ErrorType.NoError) {
          console.log(
            `creating site text translation got error: ${error}`,
            `params: siteTextlike_string: ${siteTextlike_string}, translationlike_string: ${translationlike_string}`,
          );
        }
      }
    }
  }

  async getAdminToken(): Promise<string | null> {
    try {
      const res = await this.pg.pool.query(...getAdminTokenSQL());

      return res.rows[0].token;
    } catch (e) {
      console.error(e);
    }
  }
}
