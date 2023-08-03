import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhraseVotesService } from './phrase-votes.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseReadInput,
  PhraseReadOutput,
  PhraseUpsertInput,
  PhraseWithVoteListOutput,
  PhraseWithDefinitionlikeStrings,
  PhraseWithVoteOutput,
} from './types';
import { WordUpsertInput } from 'src/components/words/types';
import { LanguageInput } from 'src/components/common/types';

import {
  GetPhraseObjByIdResultRow,
  getPhraseObjById,
  callPhraseUpsertProcedure,
  PhraseUpsertProcedureOutputRow,
  GetPhraseListByLang,
  getPhraseListByLang,
} from './sql-string';

@Injectable()
export class PhrasesService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseVoteService: PhraseVotesService,
    @Inject(forwardRef(() => PhraseDefinitionsService))
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(input: PhraseReadInput): Promise<PhraseReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseObjByIdResultRow>(
        ...getPhraseObjById(+input.phrase_id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase for id: ${input.phrase_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          phrase: {
            phrase_id: input.phrase_id,
            phrase: res1.rows[0].phrase,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }

  async upsert(
    input: PhraseUpsertInput,
    token: string,
  ): Promise<PhraseReadOutput> {
    try {
      const wordlikeStrings = input.phraselike_string.split(' ');
      const wordIds: number[] = [];

      for (const wordlikeStr of wordlikeStrings) {
        const res = await this.wordService.upsert(
          {
            wordlike_string: wordlikeStr,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          } as WordUpsertInput,
          token,
        );

        if (res.error !== ErrorType.NoError) {
          return {
            error: res.error,
            phrase: null,
          };
        }

        wordIds.push(+res.word.word_id);
      }

      const res = await this.pg.pool.query<PhraseUpsertProcedureOutputRow>(
        ...callPhraseUpsertProcedure({
          phraselike_string: input.phraselike_string,
          wordIds: wordIds,
          token: token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !phrase_id) {
        return {
          error,
          phrase: null,
        };
      }

      const phrase = await (
        await this.read({ phrase_id: phrase_id + '' })
      ).phrase;

      return {
        error,
        phrase,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }

  async getPhraseWithVoteById(
    phrase_id: number,
  ): Promise<PhraseWithVoteOutput> {
    try {
      const { error, vote_status } = await this.phraseVoteService.getVoteStatus(
        phrase_id,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          phrase_with_vote: null,
        };
      }

      const { error: readError, phrase } = await this.read({
        phrase_id: phrase_id + '',
      });

      if (readError !== ErrorType.NoError) {
        return {
          error: readError,
          phrase_with_vote: null,
        };
      }

      return {
        error,
        phrase_with_vote: {
          ...phrase,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_with_vote: null,
    };
  }

  async getPhrasesByLanguage(
    input: LanguageInput,
  ): Promise<PhraseWithVoteListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseListByLang>(
        ...getPhraseListByLang({
          ...input,
        }),
      );

      const phraseWithVoteList: PhraseWithDefinitionlikeStrings[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { phrase_id } = res1.rows[i];
        const { error, vote_status } =
          await this.phraseVoteService.getVoteStatus(+phrase_id);

        if (error !== ErrorType.NoError) {
          return {
            error,
            phrase_with_vote_list: [],
          };
        }

        const { error: definitionError, definitionlike_strings } =
          await this.phraseDefinitionService.getDefinitionlikeStringsByPhraseId(
            +phrase_id,
          );

        if (error !== ErrorType.NoError) {
          return {
            error: definitionError,
            phrase_with_vote_list: [],
          };
        }

        const { error: readError, phrase } = await this.read({
          phrase_id,
        });

        if (readError !== ErrorType.NoError) {
          return {
            error: readError,
            phrase_with_vote_list: [],
          };
        }

        phraseWithVoteList.push({
          ...phrase,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
          definitionlike_strings,
        });
      }

      return {
        error: ErrorType.NoError,
        phrase_with_vote_list: phraseWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_with_vote_list: [],
    };
  }
}
