import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseToPhraseTranslationOutput,
  PhraseToPhraseTranslationsOutput,
  PhraseToPhraseTranslationVoteStatusOutput,
  PhraseToPhraseTranslationVoteStatusOutputRow,
  PhraseToPhraseTranslationVoteStatus,
  PhraseToPhraseTranslationWithVoteListOutput,
  PhraseToPhraseTranslationWithVoteListFromIdsOutput,
  PhraseToPhraseTranslation,
} from './types';
import { PhraseDefinition } from 'src/components/definitions/types';

import {
  GetPhraseToPhraseTranslationObjectByIdRow,
  getPhraseToPhraseTranslationObjByIds,
  callPhraseToPhraseTranslationUpsertProcedure,
  PhraseToPhraseTranslationUpsertProcedureOutputRow,
  GetPhraseToPhraseTranslationVoteStatus,
  getPhraseToPhraseTranslationVoteStatusFromIds,
  TogglePhraseToPhraseTranslationVoteStatus,
  togglePhraseToPhraseTranslationVoteStatus,
  GetPhraseToPhraseTranslationListByFromPhraseDefinitionId,
  getPhraseToPhraseTranslationListByFromPhraseDefinitionIds,
} from './sql-string';

@Injectable()
export class PhraseToPhraseTranslationsService {
  constructor(
    private pg: PostgresService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationObjectByIdRow>(
        ...getPhraseToPhraseTranslationObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no phrase-to-phrase-translation for id: ${id}`);

        return {
          error: ErrorType.PhraseToPhraseTranslationNotFound,
          phrase_to_phrase_translation: null,
        };
      } else {
        const { error, phrase_definitions } =
          await this.phraseDefinitionService.reads(
            [
              +res.rows[0].from_phrase_definition_id,
              +res.rows[0].to_phrase_definition_id,
            ],
            pgClient,
          );

        if (error !== ErrorType.NoError || phrase_definitions.length < 2) {
          return {
            error: error,
            phrase_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          phrase_to_phrase_translation: {
            phrase_to_phrase_translation_id: id + '',
            from_phrase_definition: phrase_definitions[0]!,
            to_phrase_definition: phrase_definitions[1]!,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_translation: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationObjectByIdRow>(
        ...getPhraseToPhraseTranslationObjByIds(ids),
      );

      const PhraseToPhraseTranslationsMap = new Map<
        string,
        GetPhraseToPhraseTranslationObjectByIdRow
      >();

      res.rows.map((row) =>
        PhraseToPhraseTranslationsMap.set(
          row.phrase_to_phrase_translation_id,
          row,
        ),
      );

      const definitionIds = res.rows
        .map((row) => [
          +row.from_phrase_definition_id,
          +row.to_phrase_definition_id,
        ])
        .reduce((sumOfArr, row) => [...sumOfArr, ...row], []);

      const { error, phrase_definitions } =
        await this.phraseDefinitionService.reads(definitionIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          phrase_to_phrase_translations: [],
        };
      }

      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrase_definitions.forEach((phraseDefinition) =>
        phraseDefinition
          ? phraseDefinitionsMap.set(
              phraseDefinition.phrase_definition_id + '',
              phraseDefinition,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        phrase_to_phrase_translations: ids.map((id) => {
          const row = PhraseToPhraseTranslationsMap.get(id + '');

          if (!row) {
            return null;
          }

          const fromDefinition = phraseDefinitionsMap.get(
            row.from_phrase_definition_id,
          );
          const toDefinition = phraseDefinitionsMap.get(
            row.to_phrase_definition_id,
          );

          if (!fromDefinition || !toDefinition) {
            return null;
          }

          return {
            phrase_to_phrase_translation_id:
              row.phrase_to_phrase_translation_id,
            from_phrase_definition: fromDefinition,
            to_phrase_definition: toDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_translations: [],
    };
  }

  async upsert(
    fromPhraseDefinitionId: number,
    toPhraseDefinitionId: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseToPhraseTranslationUpsertProcedureOutputRow>(
        ...callPhraseToPhraseTranslationUpsertProcedure({
          fromPhraseDefinitionId,
          toPhraseDefinitionId,
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_to_phrase_translation_id =
        res.rows[0].p_phrase_to_phrase_translation_id;

      if (error !== ErrorType.NoError || !phrase_to_phrase_translation_id) {
        return {
          error: error,
          phrase_to_phrase_translation: null,
        };
      }

      const phraseToPhraseTranslationReadOutput = await this.read(
        +phrase_to_phrase_translation_id,
        pgClient,
      );

      return {
        error: phraseToPhraseTranslationReadOutput.error,
        phrase_to_phrase_translation:
          phraseToPhraseTranslationReadOutput.phrase_to_phrase_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_translation: null,
    };
  }
  async getVoteStatus(
    phrase_to_phrase_translation_id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationVoteStatus>(
        ...getPhraseToPhraseTranslationVoteStatusFromIds([
          phrase_to_phrase_translation_id,
        ]),
      );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_phrase_translation_id:
              phrase_to_phrase_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_phrase_translation_id:
              res1.rows[0].phrase_to_phrase_translation_id + '',
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
  ): Promise<PhraseToPhraseTranslationVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationVoteStatus>(
        ...getPhraseToPhraseTranslationVoteStatusFromIds(ids),
      );

      const voteStatusMap = new Map<
        string,
        PhraseToPhraseTranslationVoteStatus
      >();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.phrase_to_phrase_translation_id, {
          phrase_to_phrase_translation_id: row.phrase_to_phrase_translation_id,
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
                phrase_to_phrase_translation_id: id + '',
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
    phrase_to_phrase_translation_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<TogglePhraseToPhraseTranslationVoteStatus>(
        ...togglePhraseToPhraseTranslationVoteStatus({
          phrase_to_phrase_translation_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_to_phrase_translations_vote_id =
        res1.rows[0].p_phrase_to_phrase_translations_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !phrase_to_phrase_translations_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_to_phrase_translation_id, pgClient);
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
  ): Promise<PhraseToPhraseTranslationWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationListByFromPhraseDefinitionId>(
        ...getPhraseToPhraseTranslationListByFromPhraseDefinitionIds({
          from_phrase_definition_ids: [from_phrase_definition_id],
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const p2pTrIds = res.rows.map(
        (row) => +row.phrase_to_phrase_translation_id,
      );

      const { error: trError, phrase_to_phrase_translations } =
        await this.reads(p2pTrIds, pgClient);

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          phrase_to_phrase_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(p2pTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          phrase_to_phrase_tr_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        phrase_to_phrase_tr_with_vote_list: p2pTrIds.map((id, index) => {
          const vote_status = vote_status_list[index];
          const p2pTr = phrase_to_phrase_translations[index];

          if (!vote_status || !p2pTr) {
            return null;
          }

          if (
            id !== +vote_status.phrase_to_phrase_translation_id ||
            id !== +p2pTr.phrase_to_phrase_translation_id
          ) {
            return null;
          }

          return {
            ...p2pTr,
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
      phrase_to_phrase_tr_with_vote_list: [],
    };
  }

  async getTranslationsByFromPhraseDefinitionIds(
    from_phrase_definition_ids: number[],
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<PhraseToPhraseTranslationWithVoteListFromIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseToPhraseTranslationListByFromPhraseDefinitionId>(
        ...getPhraseToPhraseTranslationListByFromPhraseDefinitionIds({
          from_phrase_definition_ids,
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const p2pTrIdsMap = new Map<string, number[]>();
      const voteStatusMap = new Map<
        string,
        PhraseToPhraseTranslationVoteStatus
      >();
      const p2pTrMap = new Map<string, PhraseToPhraseTranslation>();

      res.rows.forEach((row) => {
        const p2pTrIds = p2pTrIdsMap.get(row.from_phrase_definition_id);

        if (p2pTrIds) {
          p2pTrIds.push(+row.phrase_to_phrase_translation_id);
        } else {
          p2pTrIdsMap.set(row.from_phrase_definition_id, [
            +row.phrase_to_phrase_translation_id,
          ]);
        }
      });

      const trIdsIter = p2pTrIdsMap.values();
      const trIds: number[] = [];

      for (const ids of trIdsIter) {
        trIds.push(...ids);
      }

      const { error: trError, phrase_to_phrase_translations } =
        await this.reads(trIds, pgClient);

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          phrase_to_phrase_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(trIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          phrase_to_phrase_tr_with_vote_list: [],
        };
      }

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? voteStatusMap.set(
              voteStatus.phrase_to_phrase_translation_id,
              voteStatus,
            )
          : null,
      );

      phrase_to_phrase_translations.forEach((p2pTr) =>
        p2pTr
          ? p2pTrMap.set(p2pTr.phrase_to_phrase_translation_id, p2pTr)
          : null,
      );

      return {
        error: ErrorType.NoError,
        phrase_to_phrase_tr_with_vote_list: from_phrase_definition_ids
          .map((from_phrase_definition_id) => {
            const trIds = p2pTrIdsMap.get(from_phrase_definition_id + '');

            return trIds ? trIds : [];
          })
          .map((ids) => {
            return ids.map((id) => {
              const vote_status = voteStatusMap.get(id + '');
              const p2pTr = p2pTrMap.get(id + '');

              if (!vote_status || !p2pTr) {
                return null;
              }

              return {
                ...p2pTr,
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
      phrase_to_phrase_tr_with_vote_list: [],
    };
  }
}
