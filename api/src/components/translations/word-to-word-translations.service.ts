import { Injectable } from '@nestjs/common';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  AddWordAsTranslationForWordOutput,
  WordToWordTranslationReadOutput,
  WordToWordTranslationUpsertOutput,
  WordTrVoteStatusOutputRow,
} from './types';

import {
  GetWordToWordTranslationObjectByIdRow,
  getWordToWordTranslationObjById,
  callWordToWordTranslationUpsertProcedure,
  WordToWordTranslationUpsertProcedureOutputRow,
} from './sql-string';
import { WordsService } from '../words/words.service';
import {
  WordTranslations,
  WordUpsertInput,
  WordWithVotes,
} from '../words/types';
import { PoolClient } from 'pg';
import { WordToWordTranslationRepository } from './word-to-word-translation.repository';
import { LanguageInput } from '../definitions/types';

@Injectable()
export class WordToWordTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private wordsService: WordsService,
    private wordToWordTranslationRepository: WordToWordTranslationRepository,
  ) {}

  async read(id: number): Promise<WordToWordTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetWordToWordTranslationObjectByIdRow>(
          ...getWordToWordTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no word-to-word-translation for id: ${id}`);
      } else {
        const fromWordDefinitionOutput = await this.wordDefinitionService.read(
          res1.rows[0].from_word_definition_id,
        );

        const toWordDefinitionOuput = await this.wordDefinitionService.read(
          res1.rows[0].to_word_definition_id,
        );

        if (fromWordDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromWordDefinitionOutput.error,
            word_to_word_translation: null,
          };
        }

        if (toWordDefinitionOuput.error !== ErrorType.NoError) {
          return {
            error: toWordDefinitionOuput.error,
            word_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_translation: {
            word_to_word_translation_id: id + '',
            from_word_definition: fromWordDefinitionOutput.word_definition,
            to_word_definition: toWordDefinitionOuput.word_definition,
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

  async upsert(
    fromWordDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
  ): Promise<WordToWordTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordToWordTranslationUpsertProcedureOutputRow>(
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
        word_to_word_translation_id,
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

  addWordAsTranslationForWord = async (
    originalDefinitionId: string,
    tWord: WordUpsertInput,
    tDefinitionText: string,
    token: string,
  ): Promise<AddWordAsTranslationForWordOutput> => {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      dbPoolClient.query('BEGIN');

      const { word_id, error: wordErr } = await this.wordsService.upsertInTrn(
        tWord,
        token,
        dbPoolClient,
      );

      const { word_definition_id, error: definitionErr } =
        await this.wordDefinitionService.upsertInTrn(
          {
            word_id,
            definition: tDefinitionText,
          },
          token,
          dbPoolClient,
        );

      const { error: translationErr } = await this.upsertInTrn(
        Number(originalDefinitionId),
        Number(word_definition_id),
        token,
        dbPoolClient,
      );

      if (
        wordErr !== ErrorType.NoError ||
        definitionErr !== ErrorType.NoError ||
        translationErr !== ErrorType.NoError
      ) {
        throw new Error('Error with adding translation');
      }

      dbPoolClient.query('COMMIT');
      return { wordTranslationId: word_id, error: ErrorType.NoError };
    } catch (error) {
      await dbPoolClient.query('ROLLBACK');
      console.log('[error]', error);
      return { wordTranslationId: null, error: ErrorType.WordInsertFailed };
    } finally {
      dbPoolClient.release();
    }
  };

  async toggleVoteStatus(
    word_to_word_translation_id: string,
    vote: boolean,
    token: string,
  ): Promise<WordTrVoteStatusOutputRow> {
    const { word_to_word_translation_vote_id, error: error } =
      await this.wordToWordTranslationRepository.toggleVoteStatus({
        word_to_word_translation_id,
        vote,
        token,
      });
    if (error !== ErrorType.NoError || !word_to_word_translation_vote_id) {
      throw new Error('Error with voting');
    }

    const res = await this.wordToWordTranslationRepository.getVotesStatus(
      word_to_word_translation_id,
    );

    return {
      vote_status: {
        upvotes: res.vote_status.upvotes,
        downvotes: res.vote_status.downvotes,
        word_to_word_translation_id:
          res.vote_status.word_to_word_translation_id,
      },
      error,
    };
  }

  chooseBestTranslation(
    wordTranslated: WordTranslations,
    langRestrictions?: LanguageInput,
  ): WordWithVotes {
    const res = wordTranslated?.translations?.reduce((bestTr, currTr) => {
      if (
        langRestrictions?.language_code &&
        currTr.language_code !== langRestrictions.language_code
      ) {
        return bestTr;
      }

      if (
        langRestrictions?.dialect_code &&
        currTr.dialect_code !== langRestrictions.dialect_code
      ) {
        return bestTr;
      }

      if (
        langRestrictions?.geo_code &&
        currTr.geo_code !== langRestrictions.geo_code
      ) {
        return bestTr;
      }

      if (bestTr?.up_votes === undefined) {
        return currTr;
      }

      const bestTrTotal =
        Number(bestTr?.up_votes || 0) - Number(bestTr?.down_votes || 0);
      const currTrTotal =
        Number(currTr?.up_votes || 0) - Number(currTr?.down_votes || 0);
      if (currTrTotal > bestTrTotal) {
        return currTr;
      }
      return bestTr;
    }, {} as WordWithVotes);
    return res;
  }

  async getDefinitionsIds(word_to_word_translation_id: string) {
    return this.wordToWordTranslationRepository.getDefinitionsIds(
      word_to_word_translation_id,
    );
  }
}
