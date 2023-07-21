import { Injectable } from '@nestjs/common';

import { PostgresService } from './postgres.service';

import { ErrorType } from 'src/common/types';
import { SiteTextsService } from 'src/components/site-text/site-texts.service';
import { SiteTextTranslationsService } from 'src/components/site-text/site-text-translations.service';

import { siteText } from './data/lang';

import { getAdminTokenSQL } from './sql-string';

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

    for (const [siteTextlike_string, translationObj] of Object.entries(
      siteText,
    )) {
      console.log('1', siteTextlike_string)
      const { site_text_word_definition, site_text_phrase_definition, error } =
        await this.siteTextService.upsert(
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
        console.error(error)
        continue;
      }

      const from_type_is_word = site_text_word_definition ? true : false;
      const from_definition_id = from_type_is_word
        ? site_text_word_definition.word_definition.word_definition_id
        : site_text_phrase_definition.phrase_definition.phrase_definition_id;

      for (const [langTag, translationlike_string] of Object.entries(
        translationObj,
      )) {
        console.log('2', langTag, translationlike_string)
        await this.siteTextTranslationService.upsertFromTranslationlikeString(
          {
            from_type_is_word,
            from_definition_id,
          },
          {
            translationlike_string: translationlike_string,
            definitionlike_string: 'Site User Interface Text Translation',
            language_code: langTag,
            dialect_code: null,
            geo_code: null,
          },
          token,
        );
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
    