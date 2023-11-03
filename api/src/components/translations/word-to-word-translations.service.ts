import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { calc_vote_weight, pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  WordToWordTranslationOutput,
  WordToWordTranslationsOutput,
  WordTrVoteStatusOutputRow,
  WordTrVoteStatusOutput,
  WordToWordTranslationWithVoteListOutput,
  WordToWordTranslationWithVoteListFromIdsOutput,
  WordTrVoteStatus,
  WordToWordTranslation,
} from './types';
import { WordDefinition } from 'src/components/definitions/types';

import {
  GetWordToWordTranslationObjectByIdRow,
  getWordToWordTranslationObjByIds,
  callWordToWordTranslationUpsertProcedure,
  WordToWordTranslationUpsertProcedureOutputRow,
  callWordToWordTranslationUpsertsProcedure,
  WordToWordTranslationUpsertsProcedureOutput,
  GetWordToWordTranslationVoteStatus,
  getWordToWordTranslationVoteStatusFromIds,
  GetWordToWordTranslationListByFromWordDefinitionId,
  getWordToWordTranslationListByFromWordDefinitionIds,
} from './sql-string';
import { WordsService } from '../words/words.service';

import { WordToWordTranslationRepository } from './word-to-word-translation.repository';
import { LanguageInput } from 'src/components/common/types';
import { MapTrWordsPhrases } from '../maps/maps.repository';

export type SomethingVoted = {
  [key: string]: any;
  up_votes: number;
  down_votes: number;
};

@Injectable()
export class WordToWordTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private wordsService: WordsService,
    private wordToWordTranslationRepository: WordToWordTranslationRepository,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationObjectByIdRow>(
        ...getWordToWordTranslationObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no word-to-word-translation for id: ${id}`);

        return {
          error: ErrorType.WordToWordTranslationNotFound,
          word_to_word_translation: null,
        };
      } else {
        const { error, word_definitions } =
          await this.wordDefinitionService.reads(
            [
              +res.rows[0].from_word_definition_id,
              +res.rows[0].to_word_definition_id,
            ],
            pgClient,
          );

        if (error !== ErrorType.NoError && word_definitions.length < 2) {
          return {
            error: error,
            word_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_translation: {
            word_to_word_translation_id: id + '',
            from_word_definition: word_definitions[0]!,
            to_word_definition: word_definitions[1]!,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationObjectByIdRow>(
        ...getWordToWordTranslationObjByIds(ids),
      );

      const wordToWordTranslationsMap = new Map<
        string,
        GetWordToWordTranslationObjectByIdRow
      >();

      res.rows.map((row) =>
        wordToWordTranslationsMap.set(row.word_to_word_translation_id, row),
      );

      const definitionIds = res.rows
        .map((row) => [
          +row.from_word_definition_id,
          +row.to_word_definition_id,
        ])
        .reduce((sumOfArr, row) => [...sumOfArr, ...row], []);

      const { error, word_definitions } =
        await this.wordDefinitionService.reads(definitionIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          word_to_word_translations: [],
        };
      }

      const wordDefinitionsMap = new Map<string, WordDefinition>();

      word_definitions.forEach((wordDefinition) =>
        wordDefinition
          ? wordDefinitionsMap.set(
              wordDefinition.word_definition_id,
              wordDefinition,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        word_to_word_translations: ids.map((id) => {
          const row = wordToWordTranslationsMap.get(id + '');

          if (!row) {
            return null;
          }

          const fromDefinition = wordDefinitionsMap.get(
            row.from_word_definition_id,
          );
          const toDefinition = wordDefinitionsMap.get(
            row.to_word_definition_id,
          );

          if (!fromDefinition || !toDefinition) {
            return null;
          }

          return {
            word_to_word_translation_id: row.word_to_word_translation_id,
            from_word_definition: fromDefinition,
            to_word_definition: toDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translations: [],
    };
  }

  async upsert(
    fromWordDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordToWordTranslationUpsertProcedureOutputRow>(
        ...callWordToWordTranslationUpsertProcedure({
          fromWordDefinitionId,
          toWordDefinitionId,
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const word_to_word_translation_id =
        res.rows[0].p_word_to_word_translation_id;

      if (error !== ErrorType.NoError || !word_to_word_translation_id) {
        return {
          error: error,
          word_to_word_translation: null,
        };
      }

      const wordToWordTranslationReadOutput = await this.read(
        +word_to_word_translation_id,
        pgClient,
      );

      return {
        error: wordToWordTranslationReadOutput.error,
        word_to_word_translation:
          wordToWordTranslationReadOutput.word_to_word_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }

  async upserts(
    input: {
      from_word_definition_id: number;
      to_word_definition_id: number;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        word_to_word_translations: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordToWordTranslationUpsertsProcedureOutput>(
        ...callWordToWordTranslationUpsertsProcedure({
          fromWordDefinitionIds: input.map(
            (item) => item.from_word_definition_id,
          ),
          toWordDefinitionIds: input.map((item) => item.to_word_definition_id),
          token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const errors = res.rows[0].p_error_types;
      const word_to_word_translation_ids =
        res.rows[0].p_word_to_word_translation_ids;

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          word_to_word_translations: [],
        };
      }

      const ids: { word_to_word_translation_id: string; error: ErrorType }[] =
        [];

      for (let i = 0; i < word_to_word_translation_ids.length; i++) {
        ids.push({
          word_to_word_translation_id: word_to_word_translation_ids[i],
          error: errors[i],
        });
      }

      const { error: readingError, word_to_word_translations } =
        await this.reads(
          ids
            .filter((id) => id.error === ErrorType.NoError)
            .map((id) => +id.word_to_word_translation_id),
          pgClient,
        );

      const w2wTrsMap = new Map<string, WordToWordTranslation>();

      word_to_word_translations.forEach((w2wTr) =>
        w2wTr ? w2wTrsMap.set(w2wTr.word_to_word_translation_id, w2wTr) : null,
      );

      return {
        error: readingError,
        word_to_word_translations: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return w2wTrsMap.get(id.word_to_word_translation_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translations: [],
    };
  }

  async upsertInTrn(
    fromWordDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ word_to_word_translation_id: string | null } & GenericOutput> {
    try {
      const res =
        await dbPoolClient.query<WordToWordTranslationUpsertProcedureOutputRow>(
          ...callWordToWordTranslationUpsertProcedure({
            fromWordDefinitionId,
            toWordDefinitionId,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const word_to_word_translation_id =
        res.rows[0].p_word_to_word_translation_id;

      if (error !== ErrorType.NoError || !word_to_word_translation_id) {
        return {
          error: error,
          word_to_word_translation_id: null,
        };
      }

      return {
        error,
        word_to_word_translation_id: String(word_to_word_translation_id),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation_id: null,
    };
  }

  async getVoteStatus(
    word_to_word_translation_id: number,
    pgClient: PoolClient | null,
  ): Promise<WordTrVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationVoteStatus>(
        ...getWordToWordTranslationVoteStatusFromIds([
          word_to_word_translation_id,
        ]),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_to_word_translation_id: word_to_word_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_to_word_translation_id:
              res.rows[0].word_to_word_translation_id,
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
  ): Promise<WordTrVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationVoteStatus>(
        ...getWordToWordTranslationVoteStatusFromIds(ids),
      );

      const voteStatusMap = new Map<string, WordTrVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.word_to_word_translation_id, {
          word_to_word_translation_id: row.word_to_word_translation_id,
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
                word_to_word_translation_id: id + '',
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
    word_to_word_translation_id: string,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordTrVoteStatusOutputRow> {
    const { word_to_word_translation_vote_id, error: error } =
      await this.wordToWordTranslationRepository.toggleVoteStatus({
        word_to_word_translation_id,
        vote,
        token,
        dbpoolClient: pgClient,
      });
    if (error !== ErrorType.NoError || !word_to_word_translation_vote_id) {
      return {
        error,
        vote_status: null,
      };
    }

    const res = await this.wordToWordTranslationRepository.getVotesStatus(
      word_to_word_translation_id,
      pgClient,
    );

    if (res.error !== ErrorType.NoError || !res.vote_status) {
      return {
        error,
        vote_status: null,
      };
    }

    return {
      vote_status: {
        upvotes: res.vote_status.upvotes,
        downvotes: res.vote_status.downvotes,
        word_to_word_translation_id:
          res.vote_status.word_to_word_translation_id,
      },
      error: ErrorType.NoError,
    };
  }

  chooseBestTranslation<T extends SomethingVoted>(
    wordOrPhraseTranslated: T[],
  ): T {
    const res = wordOrPhraseTranslated.reduce((bestTr, currTr) => {
      if (bestTr?.up_votes === undefined) {
        return currTr;
      }
      const bestTrWeight = calc_vote_weight(
        Number(bestTr?.up_votes || 0),
        Number(bestTr?.down_votes || 0),
      );
      const currTrWeight = calc_vote_weight(
        Number(currTr?.up_votes || 0),
        Number(currTr?.down_votes || 0),
      );
      if (currTrWeight > bestTrWeight) {
        return currTr;
      }
      return bestTr;
    }, {} as T);
    return res;
  }

  async getDefinitionsIds(
    word_to_word_translation_id: string,
    pgClient: PoolClient | null,
  ) {
    return this.wordToWordTranslationRepository.getDefinitionsIds(
      word_to_word_translation_id,
      pgClient,
    );
  }

  async getTranslationsByFromWordDefinitionId(
    from_word_definition_id: number,
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationListByFromWordDefinitionId>(
        ...getWordToWordTranslationListByFromWordDefinitionIds({
          from_word_definition_ids: [from_word_definition_id],
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const w2wTrIds = res.rows.map((row) => +row.word_to_word_translation_id);

      const { error: trError, word_to_word_translations } = await this.reads(
        w2wTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          word_to_word_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(w2wTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          word_to_word_tr_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        word_to_word_tr_with_vote_list: w2wTrIds.map((id, index) => {
          const vote_status = vote_status_list[index];
          const w2wTr = word_to_word_translations[index];

          if (!vote_status || !w2wTr) {
            return null;
          }

          if (
            id !== +vote_status.word_to_word_translation_id ||
            id !== +w2wTr.word_to_word_translation_id
          ) {
            return null;
          }

          return {
            ...w2wTr,
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
      word_to_word_tr_with_vote_list: [],
    };
  }

  async getTranslationsByFromWordDefinitionIds(
    from_word_definition_ids: number[],
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<WordToWordTranslationWithVoteListFromIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordToWordTranslationListByFromWordDefinitionId>(
        ...getWordToWordTranslationListByFromWordDefinitionIds({
          from_word_definition_ids,
          language_code: langInfo.language_code,
          dialect_code: langInfo.dialect_code,
          geo_code: langInfo.geo_code,
        }),
      );

      const w2wTrIdsMap = new Map<string, number[]>();
      const voteStatusMap = new Map<string, WordTrVoteStatus>();
      const w2wTrMap = new Map<string, WordToWordTranslation>();

      res.rows.forEach((row) => {
        const w2wTrIds = w2wTrIdsMap.get(row.from_word_definition_id);

        if (w2wTrIds) {
          w2wTrIds.push(+row.word_to_word_translation_id);
        } else {
          w2wTrIdsMap.set(row.from_word_definition_id, [
            +row.word_to_word_translation_id,
          ]);
        }
      });

      const w2wTrIds: number[] = [];

      for (const ids of w2wTrIdsMap.values()) {
        w2wTrIds.push(...ids);
      }

      const { error: trError, word_to_word_translations } = await this.reads(
        w2wTrIds,
        pgClient,
      );

      if (trError !== ErrorType.NoError) {
        return {
          error: trError,
          word_to_word_tr_with_vote_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.getVoteStatusFromIds(w2wTrIds, pgClient);

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          word_to_word_tr_with_vote_list: [],
        };
      }

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? voteStatusMap.set(
              voteStatus.word_to_word_translation_id,
              voteStatus,
            )
          : null,
      );

      word_to_word_translations.forEach((w2wTr) =>
        w2wTr ? w2wTrMap.set(w2wTr.word_to_word_translation_id, w2wTr) : null,
      );

      return {
        error: ErrorType.NoError,
        word_to_word_tr_with_vote_list: from_word_definition_ids
          .map((from_word_definition_id) => {
            const ids = w2wTrIdsMap.get(from_word_definition_id + '');

            return ids ? ids : [];
          })
          .map((ids) => {
            return ids.map((id) => {
              const vote_status = voteStatusMap.get(id + '');
              const w2wTr = w2wTrMap.get(id + '');

              if (!vote_status || !w2wTr) {
                return null;
              }

              return {
                ...w2wTr,
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
      word_to_word_tr_with_vote_list: [],
    };
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const translation = await this.read(+id, null);
    if (translation.error !== ErrorType.NoError) {
      console.error(translation.error);
      return 'Translation:';
    }
    return `Translation from '${translation.word_to_word_translation?.from_word_definition.word.word}' to '${translation.word_to_word_translation?.to_word_definition.word.word}'`;
  };
}
