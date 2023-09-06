import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  PhraseToWordTranslationOutput,
  PhraseToWordTranslationsOutput,
  PhraseToWordTranslationVoteStatusOutput,
  PhraseToWordTranslationVoteStatusOutputRow,
  PhraseToWordTranslationVoteStatus,
  PhraseToWordTranslationWithVoteListOutput,
  PhraseToWordTranslationWithVoteListFromIdsOutput,
  PhraseToWordTranslation,
} from './types';
import {
  WordDefinition,
  PhraseDefinition,
} from 'src/components/definitions/types';

import {
  GetPhraseToWordTranslationObjectByIdRow,
  getPhraseToWordTranslationObjByIds,
  callPhraseToWordTranslationUpsertProcedure,
  PhraseToWordTranslationUpsertProcedureOutputRow,
  callPhraseToWordTranslationUpsertsProcedure,
  PhraseToWordTranslationUpsertsProcedureOutput,
  GetPhraseToWordTranslationVoteStatus,
  getPhraseToWordTranslationVoteStatusFromIds,
  TogglePhraseToWordTranslationVoteStatus,
  togglePhraseToWordTranslationVoteStatus,
  GetPhraseToWordTranslationListByFromPhraseDefinitionId,
  getPhraseToWordTranslationListByFromPhraseDefinitionIds,
} from './sql-string';

@Injectable()
export class PhraseToWordTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationObjectByIdRow>(
        ...getPhraseToWordTranslationObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no phrase-to-phrase-translation for id: ${id}`);

        return {
          error: ErrorType.PhraseToWordTranslationNotFound,
          phrase_to_word_translation: null,
        };
      } else {
        const { error: phraseError, phrase_definitions } =
          await this.phraseDefinitionService.reads(
            [+res.rows[0].from_phrase_definition_id],
            pgClient,
          );

        if (
          phraseError !== ErrorType.NoError ||
          phrase_definitions.length === 0
        ) {
          return {
            error: phraseError,
            phrase_to_word_translation: null,
          };
        }

        const { error: wordError, word_definitions } =
          await this.wordDefinitionService.reads(
            [+res.rows[0].to_word_definition_id],
            pgClient,
          );

        if (wordError !== ErrorType.NoError || word_definitions.length === 0) {
          return {
            error: wordError,
            phrase_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          phrase_to_word_translation: {
            phrase_to_word_translation_id: id + '',
            from_phrase_definition: phrase_definitions[0]!,
            to_word_definition: word_definitions[0]!,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translation: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationObjectByIdRow>(
        ...getPhraseToWordTranslationObjByIds(ids),
      );

      const phraseToWordTranslationsMap = new Map<
        string,
        GetPhraseToWordTranslationObjectByIdRow
      >();

      res.rows.map((row) =>
        phraseToWordTranslationsMap.set(row.phrase_to_word_translation_id, row),
      );

      const phraseDefinitionIds = res.rows.map(
        (row) => +row.from_phrase_definition_id,
      );

      const { error: phraseError, phrase_definitions } =
        await this.phraseDefinitionService.reads(phraseDefinitionIds, pgClient);

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          phrase_to_word_translations: [],
        };
      }

      const wordDefinitionIds = res.rows.map(
        (row) => +row.to_word_definition_id,
      );

      const { error: wordError, word_definitions } =
        await this.wordDefinitionService.reads(wordDefinitionIds, pgClient);

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          phrase_to_word_translations: [],
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
        phrase_to_word_translations: ids.map((id) => {
          const row = phraseToWordTranslationsMap.get(id + '');

          if (!row) {
            return null;
          }

          const fromDefinition = phraseDefinitionsMap.get(
            row.from_phrase_definition_id,
          );
          const toDefinition = wordDefinitionsMap.get(
            row.to_word_definition_id,
          );

          if (!fromDefinition || !toDefinition) {
            return null;
          }

          return {
            phrase_to_word_translation_id: row.phrase_to_word_translation_id,
            from_phrase_definition: fromDefinition,
            to_word_definition: toDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translations: [],
    };
  }

  async upsert(
    fromPhraseDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseToWordTranslationUpsertProcedureOutputRow>(
        ...callPhraseToWordTranslationUpsertProcedure({
          fromPhraseDefinitionId,
          toWordDefinitionId,
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_to_word_translation_id =
        res.rows[0].p_phrase_to_word_translation_id;

      if (error !== ErrorType.NoError || !phrase_to_word_translation_id) {
        return {
          error: error,
          phrase_to_word_translation: null,
        };
      }

      const phraseToWordTranslationReadOutput = await this.read(
        +phrase_to_word_translation_id,
        pgClient,
      );

      return {
        error: phraseToWordTranslationReadOutput.error,
        phrase_to_word_translation:
          phraseToWordTranslationReadOutput.phrase_to_word_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translation: null,
    };
  }

  async upserts(
    input: {
      from_phrase_definition_id: number;
      to_word_definition_id: number;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        phrase_to_word_translations: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseToWordTranslationUpsertsProcedureOutput>(
        ...callPhraseToWordTranslationUpsertsProcedure({
          fromPhraseDefinitionIds: input.map(
            (item) => item.from_phrase_definition_id,
          ),
          toWordDefinitionIds: input.map((item) => item.to_word_definition_id),
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const errors = res.rows[0].p_error_types;
      const phrase_to_word_translation_ids =
        res.rows[0].p_phrase_to_word_translation_ids;

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          phrase_to_word_translations: [],
        };
      }

      const ids: {
        phrase_to_word_translation_id: string;
        error: ErrorType;
      }[] = [];

      for (let i = 0; i < phrase_to_word_translation_ids.length; i++) {
        ids.push({
          phrase_to_word_translation_id: phrase_to_word_translation_ids[i],
          error: errors[i],
        });
      }

      const { error: readingError, phrase_to_word_translations } =
        await this.reads(
          ids
            .filter((id) => id.error === ErrorType.NoError)
            .map((id) => +id.phrase_to_word_translation_id),
          pgClient,
        );

      const p2wTrsMap = new Map<string, PhraseToWordTranslation>();

      phrase_to_word_translations.forEach((p2wTr) =>
        p2wTr
          ? p2wTrsMap.set(p2wTr.phrase_to_word_translation_id, p2wTr)
          : null,
      );

      return {
        error: readingError,
        phrase_to_word_translations: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return p2wTrsMap.get(id.phrase_to_word_translation_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translations: [],
    };
  }

  async getVoteStatus(
    phrase_to_word_translation_id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationVoteStatus>(
        ...getPhraseToWordTranslationVoteStatusFromIds([
          phrase_to_word_translation_id,
        ]),
      );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_word_translation_id: phrase_to_word_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_word_translation_id:
              res1.rows[0].phrase_to_word_translation_id,
            upvotes: res1.rows[0].upvotes,
            downvotes: res1.rows[0].downvotes,
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
  ): Promise<PhraseToWordTranslationVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationVoteStatus>(
        ...getPhraseToWordTranslationVoteStatusFromIds(ids),
      );

      const voteStatusMap = new Map<
        string,
        PhraseToWordTranslationVoteStatus
      >();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.phrase_to_word_translation_id, {
          phrase_to_word_translation_id: row.phrase_to_word_translation_id,
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
                phrase_to_word_translation_id: id + '',
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
    phrase_to_word_translation_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<TogglePhraseToWordTranslationVoteStatus>(
        ...togglePhraseToWordTranslationVoteStatus({
          phrase_to_word_translation_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_to_word_translations_vote_id =
        res1.rows[0].p_phrase_to_word_translations_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !phrase_to_word_translations_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_to_word_translation_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getTranslationsByFromPhraseDefinitionId(
    from_phrase_definition_id: number,
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationListByFromPhraseDefinitionId>(
        ...getPhraseToWordTranslationListByFromPhraseDefinitionIds({
          from_phrase_definition_ids: [from_phrase_definition_id],
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const p2wTrIds = res.rows.map(
        (row) => +row.phrase_to_word_translation_id,
      );

      const { error: trError, phrase_to_word_translations } = await this.reads(
        p2wTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          phrase_to_word_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(p2wTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          phrase_to_word_tr_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        phrase_to_word_tr_with_vote_list: p2wTrIds.map((id, index) => {
          const vote_status = vote_status_list[index];
          const p2wTr = phrase_to_word_translations[index];

          if (!vote_status || !p2wTr) {
            return null;
          }

          if (
            id !== +vote_status.phrase_to_word_translation_id ||
            id !== +p2wTr.phrase_to_word_translation_id
          ) {
            return null;
          }

          return {
            ...p2wTr,
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
      phrase_to_word_tr_with_vote_list: [],
    };
  }

  async getTranslationsByFromPhraseDefinitionIds(
    from_phrase_definition_ids: number[],
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<PhraseToWordTranslationWithVoteListFromIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToWordTranslationListByFromPhraseDefinitionId>(
        ...getPhraseToWordTranslationListByFromPhraseDefinitionIds({
          from_phrase_definition_ids,
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const p2wTrIdsMap = new Map<string, number[]>();
      const voteStatusMap = new Map<
        string,
        PhraseToWordTranslationVoteStatus
      >();
      const p2wTrMap = new Map<string, PhraseToWordTranslation>();

      res.rows.forEach((row) => {
        const p2wTrIds = p2wTrIdsMap.get(row.from_phrase_definition_id);

        if (p2wTrIds) {
          p2wTrIds.push(+row.phrase_to_word_translation_id);
        } else {
          p2wTrIdsMap.set(row.from_phrase_definition_id, [
            +row.phrase_to_word_translation_id,
          ]);
        }
      });

      const p2wTrIds: number[] = [];

      for (const ids of p2wTrIdsMap.values()) {
        p2wTrIds.push(...ids);
      }

      const { error: trError, phrase_to_word_translations } = await this.reads(
        p2wTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          phrase_to_word_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(p2wTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          phrase_to_word_tr_with_vote_list: [],
        };
      }

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? voteStatusMap.set(
              voteStatus.phrase_to_word_translation_id,
              voteStatus,
            )
          : null,
      );

      phrase_to_word_translations.forEach((p2wTr) =>
        p2wTr ? p2wTrMap.set(p2wTr.phrase_to_word_translation_id, p2wTr) : null,
      );

      return {
        error: ErrorType.NoError,
        phrase_to_word_tr_with_vote_list: from_phrase_definition_ids
          .map((from_phrase_definition_id) => {
            const ids = p2wTrIdsMap.get(from_phrase_definition_id + '');

            return ids ? ids : [];
          })
          .map((ids) => {
            return ids.map((id) => {
              const vote_status = voteStatusMap.get(id + '');
              const p2wTr = p2wTrMap.get(id + '');

              if (!vote_status || !p2wTr) {
                return null;
              }

              return {
                ...p2wTr,
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
      phrase_to_word_tr_with_vote_list: [],
    };
  }
}
