import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

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
  SiteTextDefinitionListConnection,
  SiteTextLanguageListOutput,
  SiteTextLanguageWithTranslationInfoListOutput,
  SiteTextLanguageWithTranslationInfo,
  SiteTextDefinitionEdge,
} from './types';

import {
  GetSiteTextLanguageList,
  getSiteTextLanguageList,
  SiteTextTranslationCountRow,
  getSiteTextTranslationCount,
  GetAllSiteTextWordDefinition,
  getAllSiteTextWordDefinition,
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
} from './sql-string';

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
    pgClient: PoolClient | null,
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
          pgClient,
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
            pgClient,
          );

        if (!phrase_definition_id) {
          const phraseDefinitionOutput =
            await this.phraseDefinitionService.upsert(
              {
                phrase_id: phraseOuptut.phrase.phrase_id,
                definition: input.definitionlike_string,
              },
              token,
              pgClient,
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
          pgClient,
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
          pgClient,
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
            pgClient,
          );

        if (!word_definition_id) {
          const wordDefinitionOutput = await this.wordDefinitionService.upsert(
            {
              word_id: wordOutput.word.word_id,
              definition: input.definitionlike_string,
            },
            token,
            pgClient,
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
          pgClient,
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

  async getAllSiteTextDefinitions({
    filter,
    first,
    after,
    pgClient,
  }: {
    filter?: string;
    first: number | null;
    after: string | null;
    pgClient: PoolClient | null;
  }): Promise<SiteTextDefinitionListConnection> {
    try {
      let wordAfter: string | null = null;
      let phraseAfter: string | null = null;

      if (after) {
        wordAfter = JSON.parse(after).wordCursor;
        phraseAfter = JSON.parse(after).phraseCursor;
      }

      const { error: wordError, edges: wordEdges } =
        await this.siteTextWordDefinitionService.getAllSiteTextWordDefinitions({
          filter,
          first,
          after: wordAfter,
          pgClient,
        });

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const { error: phraseError, edges: phraseEdges } =
        await this.siteTextPhraseDefinitionService.getAllSiteTextPhraseDefinitions(
          {
            filter,
            first,
            after: phraseAfter,
            pgClient,
          },
        );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const edges: SiteTextDefinitionEdge[] = [];
      let wordTop = 0;
      let phraseTop = 0;

      while (true) {
        if (first && edges.length === first) {
          break;
        }

        if (wordTop === wordEdges.length && phraseTop === phraseEdges.length) {
          break;
        }

        if (wordEdges.length === 0) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: null,
              phraseCursor: phraseEdges[phraseTop].cursor,
            }),
            node: phraseEdges[phraseTop].node,
          });
          phraseTop++;
          continue;
        }

        if (phraseEdges.length === 0) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: wordEdges[wordTop].cursor,
              phraseCursor: null,
            }),
            node: wordEdges[wordTop].node,
          });
          wordTop++;
          continue;
        }

        if (wordTop === wordEdges.length) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: wordTop > 0 ? wordEdges[wordTop - 1].cursor : null,
              phraseCursor: phraseEdges[phraseTop].cursor,
            }),
            node: phraseEdges[phraseTop].node,
          });
          phraseTop++;
          continue;
        }

        if (phraseTop === phraseEdges.length) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: wordEdges[wordTop].cursor,
              phraseCursor:
                phraseTop > 0 ? phraseEdges[phraseTop - 1].cursor : null,
            }),
            node: wordEdges[wordTop].node,
          });
          wordTop++;
          continue;
        }

        if (wordEdges[wordTop].cursor > phraseEdges[phraseTop].cursor) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: wordTop > 0 ? wordEdges[wordTop - 1].cursor : null,
              phraseCursor: phraseEdges[phraseTop].cursor,
            }),
            node: phraseEdges[phraseTop].node,
          });
          phraseTop++;
          continue;
        }

        if (wordEdges[wordTop].cursor <= phraseEdges[phraseTop].cursor) {
          edges.push({
            cursor: JSON.stringify({
              wordCursor: wordEdges[wordTop].cursor,
              phraseCursor:
                phraseTop > 0 ? phraseEdges[phraseTop - 1].cursor : null,
            }),
            node: wordEdges[wordTop].node,
          });
          wordTop++;
          continue;
        }
      }

      return {
        error: ErrorType.NoError,
        edges,
        pageInfo: {
          hasNextPage: first
            ? wordEdges.length + phraseEdges.length > first
            : false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor:
            edges.length > 0 ? edges[edges.length - 1].cursor || null : null,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  async getAllSiteTextLanguageList(
    pgClient: PoolClient | null,
  ): Promise<SiteTextLanguageListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextLanguageList>(...getSiteTextLanguageList());
      const siteTextLanguageList: {
        language_code: string;
        dialect_code: string | null;
        geo_code: string | null;
      }[] = [];

      for (let i = 0; i < res.rowCount; i++) {
        siteTextLanguageList.push({
          language_code: res.rows[i].language_code,
          dialect_code: res.rows[i].dialect_code,
          geo_code: res.rows[i].geo_code,
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

  async getAllSiteTextLanguageListWithRate(
    pgClient: PoolClient | null,
  ): Promise<SiteTextLanguageWithTranslationInfoListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<SiteTextTranslationCountRow>(...getSiteTextTranslationCount());

      const languagesMap = new Map<
        string,
        {
          language_code: string;
          dialect_code: string | null;
          geo_code: string | null;
        }
      >();
      const siteTextTrCountMap = new Map<string, number>();

      const makeKey = (
        language_code: string,
        dialect_code: string | null,
        geo_code: string | null,
      ) => {
        return `${language_code}-${dialect_code ? dialect_code : 'null'}-${
          geo_code ? geo_code : 'null'
        }`;
      };

      for (let i = 0; i < res.rowCount; i++) {
        const language = {
          language_code: res.rows[i].language_code,
          dialect_code: res.rows[i].dialect_code,
          geo_code: res.rows[i].geo_code,
        };

        languagesMap.set(
          makeKey(
            language.language_code,
            language.dialect_code,
            language.geo_code,
          ),
          language,
        );

        const count = res.rows[i].count;

        if (+count === 0) {
          continue;
        }

        const mapCount = siteTextTrCountMap.get(
          makeKey(
            language.language_code,
            language.dialect_code,
            language.geo_code,
          ),
        );

        if (mapCount === undefined) {
          siteTextTrCountMap.set(
            makeKey(
              language.language_code,
              language.dialect_code,
              language.geo_code,
            ),
            1,
          );
        } else {
          siteTextTrCountMap.set(
            makeKey(
              language.language_code,
              language.dialect_code,
              language.geo_code,
            ),
            mapCount + 1,
          );
        }
      }

      const res2 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextWordDefinition>(
        ...getAllSiteTextWordDefinition({ first: null, after: null }),
      );

      const res3 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition({ first: null, after: null }),
      );

      const total_count = res2.rowCount + res3.rowCount;

      const result: SiteTextLanguageWithTranslationInfo[] = [];

      for (const language of languagesMap.values()) {
        result.push({
          language_code: language.language_code,
          dialect_code: language.dialect_code,
          geo_code: language.geo_code,
          total_count,
          translated_count:
            siteTextTrCountMap.get(
              makeKey(
                language.language_code,
                language.dialect_code,
                language.geo_code,
              ),
            ) || 0,
        });
      }

      return {
        error: ErrorType.NoError,
        site_text_language_with_translation_info_list: result,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_language_with_translation_info_list: [],
    };
  }
}
