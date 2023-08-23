import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';
import { WordsService } from 'src/components/words/words.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

import {
  SiteTextUpsertInput,
  SiteTextDefinitionOutput,
  SiteTextDefinitionListOutput,
  SiteTextLanguageListOutput,
} from './types';

import { GetSiteTextLanguageList, getSiteTextLanguageList } from './sql-string';

@Injectable()
export class SiteTextsService {
  constructor(
    private pg: PostgresService,
    private siteTextWordDefinitionService: SiteTextWordDefinitionsService,
    private siteTextPhraseDefinitionService: SiteTextPhraseDefinitionsService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
    private phraseService: PhrasesService,
    private wordService: WordsService,
  ) {}

  async upsert(
    input: SiteTextUpsertInput,
    token: string,
  ): Promise<SiteTextDefinitionOutput> {
    if (input.siteTextlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        site_text_definition: null,
      };
    }

    try {
      const words = input.siteTextlike_string
        .trim()
        .split(' ')
        .filter((w) => w !== '');

      if (words.length > 1) {
        const phraseOuptut = await this.phraseService.upsert(
          {
            phraselike_string: input.siteTextlike_string.trim(),
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          },
          token,
        );

        if (phraseOuptut.error !== ErrorType.NoError || !phraseOuptut.phrase) {
          return {
            error: phraseOuptut.error,
            site_text_definition: null,
          };
        }

        let phrase_definition_id =
          await this.siteTextPhraseDefinitionService.getDefinitionIdFromWordId(
            +phraseOuptut.phrase.phrase_id,
          );

        if (!phrase_definition_id) {
          const phraseDefinitionOutput =
            await this.phraseDefinitionService.upsert(
              {
                phrase_id: phraseOuptut.phrase.phrase_id,
                definition: input.definitionlike_string,
              },
              token,
            );

          if (
            phraseDefinitionOutput.error !== ErrorType.NoError ||
            phraseDefinitionOutput.phrase_definition === null
          ) {
            return {
              error: phraseDefinitionOutput.error,
              site_text_definition: null,
            };
          }

          phrase_definition_id =
            +phraseDefinitionOutput.phrase_definition.phrase_definition_id;
        }

        const {
          error: siteTextWordDefinitionError,
          site_text_phrase_definition,
        } = await this.siteTextPhraseDefinitionService.upsert(
          phrase_definition_id,
          token,
        );

        return {
          error: siteTextWordDefinitionError,
          site_text_definition: site_text_phrase_definition,
        };
      } else {
        const wordOutput = await this.wordService.upsert(
          {
            wordlike_string: input.siteTextlike_string.trim(),
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          },
          token,
        );

        if (wordOutput.error !== ErrorType.NoError || !wordOutput.word) {
          return {
            error: wordOutput.error,
            site_text_definition: null,
          };
        }

        let word_definition_id =
          await this.siteTextWordDefinitionService.getDefinitionIdFromWordId(
            +wordOutput.word.word_id,
          );

        if (!word_definition_id) {
          const wordDefinitionOutput = await this.wordDefinitionService.upsert(
            {
              word_id: wordOutput.word.word_id,
              definition: input.definitionlike_string,
            },
            token,
          );

          if (
            wordDefinitionOutput.error !== ErrorType.NoError ||
            wordDefinitionOutput.word_definition === null
          ) {
            return {
              error: wordDefinitionOutput.error,
              site_text_definition: null,
            };
          }

          word_definition_id =
            +wordDefinitionOutput.word_definition.word_definition_id;
        }

        const {
          error: siteTextWordDefinitionError,
          site_text_word_definition,
        } = await this.siteTextWordDefinitionService.upsert(
          word_definition_id,
          token,
        );

        return {
          error: siteTextWordDefinitionError,
          site_text_definition: site_text_word_definition,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_definition: null,
    };
  }

  async getAllSiteTextDefinitions(
    filter?: string,
  ): Promise<SiteTextDefinitionListOutput> {
    try {
      const { error: wordError, site_text_word_definition_list } =
        await this.siteTextWordDefinitionService.getAllSiteTextWordDefinitions(
          filter,
        );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          site_text_definition_list: null,
        };
      }

      const { error: phraseError, site_text_phrase_definition_list } =
        await this.siteTextPhraseDefinitionService.getAllSiteTextPhraseDefinitions(
          filter,
        );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          site_text_definition_list: null,
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_definition_list: [
          ...site_text_word_definition_list,
          ...site_text_phrase_definition_list,
        ],
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_definition_list: null,
    };
  }

  async getAllSiteTextLanguageList(): Promise<SiteTextLanguageListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetSiteTextLanguageList>(
        ...getSiteTextLanguageList(),
      );
      const siteTextLanguageList = [];

      for (let i = 0; i < res1.rowCount; i++) {
        siteTextLanguageList.push({
          language_code: res1.rows[i].language_code,
          dialect_code: res1.rows[i].dialect_code,
          geo_code: res1.rows[i].geo_code,
        });
      }

      return {
        error: ErrorType.NoError,
        site_text_language_list: siteTextLanguageList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_language_list: [],
    };
  }
}
