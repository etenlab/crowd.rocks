import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  WordToPhraseTranslationOutput,
  WordToPhraseTranslationsOutput,
  WordToPhraseTranslationVoteStatus,
  WordToPhraseTranslationVoteStatusOutput,
  WordToPhraseTranslationVoteStatusOutputRow,
  WordToPhraseTranslationWithVoteListOutput,
  WordToPhraseTranslationWithVoteListFromIdsOutput,
  WordToPhraseTranslation,
} from './types';
import {
  WordDefinition,
  PhraseDefinition,
} from 'src/components/definitions/types';

import {
  GetWordToPhraseTranslationObjectByIdRow,
  getWordToPhraseTranslationObjByIds,
  callWordToPhraseTranslationUpsertProcedure,
  WordToPhraseTranslationUpsertProcedureOutputRow,
  callWordToPhraseTranslationUpsertsProcedure,
  WordToPhraseTranslationUpsertsProcedureOutput,
  GetWordToPhraseTranslationVoteStatus,
  getWordToPhraseTranslationVoteStatusFromIds,
  ToggleWordToPhraseTranslationVoteStatus,
  toggleWordToPhraseTranslationVoteStatus,
  GetWordToPhraseTranslationListByFromWordDefinitionId,
  getWordToPhraseTranslationListByFromWordDefinitionIds,
} from './sql-string';

@Injectable()
export class WordToPhraseTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationObjectByIdRow>(
        ...getWordToPhraseTranslationObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no word-to-phrase-translation for id: ${id}`);

        return {
          error: ErrorType.WordToPhraseTranslationNotFound,
          word_to_phrase_translation: null,
        };
      } else {
        const { error: wordError, word_definitions } =
          await this.wordDefinitionService.reads(
            [+res.rows[0].from_word_definition_id],
            pgClient,
          );

        if (wordError !== ErrorType.NoError || word_definitions.length === 0) {
          return {
            error: wordError,
            word_to_phrase_translation: null,
          };
        }

        const { error: phraseError, phrase_definitions } =
          await this.phraseDefinitionService.reads(
            [+res.rows[0].to_phrase_definition_id],
            pgClient,
          );

        if (
          phraseError !== ErrorType.NoError ||
          phrase_definitions.length === 0
        ) {
          return {
            error: phraseError,
            word_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_phrase_translation: {
            word_to_phrase_translation_id: id + '',
            from_word_definition: word_definitions[0]!,
            to_phrase_definition: phrase_definitions[0]!,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationObjectByIdRow>(
        ...getWordToPhraseTranslationObjByIds(ids),
      );

      const wordToPhraseTranslationsMap = new Map<
        string,
        GetWordToPhraseTranslationObjectByIdRow
      >();

      res.rows.map((row) =>
        wordToPhraseTranslationsMap.set(row.word_to_phrase_translation_id, row),
      );

      const wordDefinitionIds = res.rows.map(
        (row) => +row.from_word_definition_id,
      );

      const { error: wordError, word_definitions } =
        await this.wordDefinitionService.reads(wordDefinitionIds, pgClient);

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          word_to_phrase_translations: [],
        };
      }

      const phraseDefinitionIds = res.rows.map(
        (row) => +row.to_phrase_definition_id,
      );

      const { error: phraseError, phrase_definitions } =
        await this.phraseDefinitionService.reads(phraseDefinitionIds, pgClient);

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          word_to_phrase_translations: [],
        };
      }

      const wordDefinitionsMap = new Map<string, WordDefinition>();
      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      word_definitions.forEach((wordDefinition) =>
        wordDefinition
          ? wordDefinitionsMap.set(
              wordDefinition.word_definition_id,
              wordDefinition,
            )
          : null,
      );

      phrase_definitions.forEach((phraseDefinition) =>
        phraseDefinition
          ? phraseDefinitionsMap.set(
              phraseDefinition.phrase_definition_id,
              phraseDefinition,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        word_to_phrase_translations: ids.map((id) => {
          const row = wordToPhraseTranslationsMap.get(id + '');

          if (!row) {
            return null;
          }

          const fromDefinition = wordDefinitionsMap.get(
            row.from_word_definition_id,
          );
          const toDefinition = phraseDefinitionsMap.get(
            row.to_phrase_definition_id,
          );

          if (!fromDefinition || !toDefinition) {
            return null;
          }

          return {
            word_to_phrase_translation_id: row.word_to_phrase_translation_id,
            from_word_definition: fromDefinition,
            to_phrase_definition: toDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translations: [],
    };
  }

  async upsert(
    fromWordDefinitionId: number,
    toPhraseDefinitionId: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordToPhraseTranslationUpsertProcedureOutputRow>(
        ...callWordToPhraseTranslationUpsertProcedure({
          fromWordDefinitionId,
          toPhraseDefinitionId,
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const word_to_phrase_translation_id =
        res.rows[0].p_word_to_phrase_translation_id;

      if (error !== ErrorType.NoError || !word_to_phrase_translation_id) {
        return {
          error: error,
          word_to_phrase_translation: null,
        };
      }

      const wordToPhraseTranslationReadOutput = await this.read(
        +word_to_phrase_translation_id,
        pgClient,
      );

      return {
        error: wordToPhraseTranslationReadOutput.error,
        word_to_phrase_translation:
          wordToPhraseTranslationReadOutput.word_to_phrase_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }

  async upserts(
    input: {
      from_word_definition_id: number;
      to_phrase_definition_id: number;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        word_to_phrase_translations: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordToPhraseTranslationUpsertsProcedureOutput>(
        ...callWordToPhraseTranslationUpsertsProcedure({
          fromWordDefinitionIds: input.map(
            (item) => item.from_word_definition_id,
          ),
          toPhraseDefinitionIds: input.map(
            (item) => item.to_phrase_definition_id,
          ),
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const errors = res.rows[0].p_error_types;
      const word_to_phrase_translation_ids =
        res.rows[0].p_word_to_phrase_translation_ids;

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          word_to_phrase_translations: [],
        };
      }

      const ids: { word_to_phrase_translation_id: string; error: ErrorType }[] =
        [];

      for (let i = 0; i < word_to_phrase_translation_ids.length; i++) {
        ids.push({
          word_to_phrase_translation_id: word_to_phrase_translation_ids[i],
          error: errors[i],
        });
      }

      const { error: readingError, word_to_phrase_translations } =
        await this.reads(
          ids
            .filter((id) => id.error === ErrorType.NoError)
            .map((id) => +id.word_to_phrase_translation_id),
          pgClient,
        );

      const w2pTrsMap = new Map<string, WordToPhraseTranslation>();

      word_to_phrase_translations.forEach((w2pTr) =>
        w2pTr
          ? w2pTrsMap.set(w2pTr.word_to_phrase_translation_id, w2pTr)
          : null,
      );

      return {
        error: readingError,
        word_to_phrase_translations: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return w2pTrsMap.get(id.word_to_phrase_translation_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translations: [],
    };
  }

  async getVoteStatus(
    word_to_phrase_translation_id: number,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationVoteStatus>(
        ...getWordToPhraseTranslationVoteStatusFromIds([
          word_to_phrase_translation_id,
        ]),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_to_phrase_translation_id: word_to_phrase_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_to_phrase_translation_id:
              res.rows[0].word_to_phrase_translation_id + '',
            upvotes: res.rows[0].upvotes,
            downvotes: res.rows[0].downvotes,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getVoteStatusFromIds(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationVoteStatus>(
        ...getWordToPhraseTranslationVoteStatusFromIds(ids),
      );

      const voteStatusMap = new Map<
        string,
        WordToPhraseTranslationVoteStatus
      >();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.word_to_phrase_translation_id, {
          word_to_phrase_translation_id: row.word_to_phrase_translation_id,
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: ids.map((id) => {
          const voteStatus = voteStatusMap.get(id + '');

          return voteStatus
            ? voteStatus
            : {
                word_to_phrase_translation_id: id + '',
                upvotes: 0,
                downvotes: 0,
              };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async toggleVoteStatus(
    word_to_phrase_translation_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleWordToPhraseTranslationVoteStatus>(
        ...toggleWordToPhraseTranslationVoteStatus({
          word_to_phrase_translation_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const word_to_phrase_translations_vote_id =
        res1.rows[0].p_word_to_phrase_translations_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !word_to_phrase_translations_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(word_to_phrase_translation_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getTranslationsByFromWordDefinitionId(
    from_word_definition_id: number,
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationListByFromWordDefinitionId>(
        ...getWordToPhraseTranslationListByFromWordDefinitionIds({
          from_word_definition_ids: [from_word_definition_id],
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const w2pTrIds = res.rows.map(
        (row) => +row.word_to_phrase_translation_id,
      );

      const { error: trError, word_to_phrase_translations } = await this.reads(
        w2pTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          word_to_phrase_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(w2pTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          word_to_phrase_tr_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        word_to_phrase_tr_with_vote_list: w2pTrIds.map((id, index) => {
          const vote_status = vote_status_list[index];
          const w2pTr = word_to_phrase_translations[index];

          if (!vote_status || !w2pTr) {
            return null;
          }

          if (
            id !== +vote_status.word_to_phrase_translation_id ||
            id !== +w2pTr.word_to_phrase_translation_id
          ) {
            return null;
          }

          return {
            ...w2pTr,
            upvotes: vote_status.upvotes,
            downvotes: vote_status.downvotes,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_tr_with_vote_list: [],
    };
  }

  async getTranslationsByFromWordDefinitionIds(
    from_word_definition_ids: number[],
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<WordToPhraseTranslationWithVoteListFromIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToPhraseTranslationListByFromWordDefinitionId>(
        ...getWordToPhraseTranslationListByFromWordDefinitionIds({
          from_word_definition_ids,
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const w2pTrIdsMap = new Map<string, number[]>();
      const voteStatusMap = new Map<
        string,
        WordToPhraseTranslationVoteStatus
      >();
      const w2pTrMap = new Map<string, WordToPhraseTranslation>();

      res.rows.forEach((row) => {
        const w2pTrIds = w2pTrIdsMap.get(row.from_word_definition_id);

        if (w2pTrIds) {
          w2pTrIds.push(+row.word_to_phrase_translation_id);
        } else {
          w2pTrIdsMap.set(row.from_word_definition_id, [
            +row.word_to_phrase_translation_id,
          ]);
        }
      });

      const w2pTrIds: number[] = [];

      for (const ids of w2pTrIdsMap.values()) {
        w2pTrIds.push(...ids);
      }

      const { error: trError, word_to_phrase_translations } = await this.reads(
        w2pTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          word_to_phrase_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(w2pTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          word_to_phrase_tr_with_vote_list: [],
        };
      }

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? voteStatusMap.set(
              voteStatus.word_to_phrase_translation_id,
              voteStatus,
            )
          : null,
      );

      word_to_phrase_translations.forEach((w2pTr) =>
        w2pTr ? w2pTrMap.set(w2pTr.word_to_phrase_translation_id, w2pTr) : null,
      );

      return {
        error: ErrorType.NoError,
        word_to_phrase_tr_with_vote_list: from_word_definition_ids
          .map((from_word_definition_id) => {
            const ids = w2pTrIdsMap.get(from_word_definition_id + '');

            return ids ? ids : [];
          })
          .map((ids) => {
            return ids.map((id) => {
              const vote_status = voteStatusMap.get(id + '');
              const w2pTr = w2pTrMap.get(id + '');

              if (!vote_status || !w2pTr) {
                return null;
              }

              return {
                ...w2pTr,
                upvotes: vote_status.upvotes,
                downvotes: vote_status.downvotes,
              };
            });
          }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_tr_with_vote_list: [],
    };
  }
}
