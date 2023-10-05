import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { WordToPhraseTranslationsService } from '../translations/word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from '../translations/phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from '../translations/phrase-to-phrase-translations.service';

import {
  SiteTextTranslationVoteStatus,
  SiteTextTranslationVoteStatusOutput,
  SiteTextTranslationVoteStatusOutputRow,
} from './types';

export function makeStr(
  translation_id: string,
  from_type_is_word: boolean,
  to_type_is_word: boolean,
) {
  return `${translation_id}-${from_type_is_word ? 'true' : 'false'}-${
    to_type_is_word ? 'true' : 'false'
  }`;
}

@Injectable()
export class SiteTextTranslationVotesService {
  constructor(
    private pg: PostgresService,
    private w2wTrService: WordToWordTranslationsService,
    private w2pTrService: WordToPhraseTranslationsService,
    private p2wTrService: PhraseToWordTranslationsService,
    private p2pTrService: PhraseToPhraseTranslationsService,
  ) {}

  async getVoteStatus(
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      let error: ErrorType = ErrorType.NoError;
      let upvotes = 0;
      let downvotes = 0;

      if (from_type_is_word && to_type_is_word) {
        const { error: w2wError, vote_status } =
          await this.w2wTrService.getVoteStatus(translation_id, pgClient);

        error = w2wError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (from_type_is_word && !to_type_is_word) {
        const { error: w2pError, vote_status } =
          await this.w2pTrService.getVoteStatus(translation_id, pgClient);

        error = w2pError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (!from_type_is_word && to_type_is_word) {
        const { error: p2wError, vote_status } =
          await this.p2wTrService.getVoteStatus(translation_id, pgClient);

        error = p2wError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (!from_type_is_word && !to_type_is_word) {
        const { error: p2pError, vote_status } =
          await this.p2pTrService.getVoteStatus(translation_id, pgClient);

        error = p2pError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      }

      return {
        error,
        vote_status: {
          translation_id: translation_id + '',
          from_type_is_word,
          to_type_is_word,
          upvotes,
          downvotes,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getVoteStatusFromIds(
    ids: {
      translation_id: number;
      from_type_is_word: boolean;
      to_type_is_word: boolean;
    }[],
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutput> {
    try {
      if (ids.length === 0) {
        return {
          error: ErrorType.NoError,
          vote_status_list: [],
        };
      }

      const w2wIds: number[] = [];
      const w2pIds: number[] = [];
      const p2wIds: number[] = [];
      const p2pIds: number[] = [];

      ids.forEach(({ translation_id, from_type_is_word, to_type_is_word }) => {
        if (from_type_is_word && to_type_is_word) {
          w2wIds.push(translation_id);
        } else if (from_type_is_word && !to_type_is_word) {
          w2pIds.push(translation_id);
        } else if (!from_type_is_word && to_type_is_word) {
          p2wIds.push(translation_id);
        } else if (!from_type_is_word && !to_type_is_word) {
          p2pIds.push(translation_id);
        }
      });

      const { error: w2wError, vote_status_list: w2w_list } =
        await this.w2wTrService.getVoteStatusFromIds(w2wIds, pgClient);
      const { error: w2pError, vote_status_list: w2p_list } =
        await this.w2pTrService.getVoteStatusFromIds(w2pIds, pgClient);
      const { error: p2wError, vote_status_list: p2w_list } =
        await this.p2wTrService.getVoteStatusFromIds(p2wIds, pgClient);
      const { error: p2pError, vote_status_list: p2p_list } =
        await this.p2pTrService.getVoteStatusFromIds(p2pIds, pgClient);

      const voteStatusMap = new Map<string, SiteTextTranslationVoteStatus>();

      if (w2wError === ErrorType.NoError) {
        w2w_list.forEach((voteStatus) =>
          voteStatus
            ? voteStatusMap.set(
                makeStr(voteStatus.word_to_word_translation_id, true, true),
                {
                  translation_id: voteStatus.word_to_word_translation_id,
                  from_type_is_word: true,
                  to_type_is_word: true,
                  upvotes: voteStatus.upvotes,
                  downvotes: voteStatus.downvotes,
                },
              )
            : null,
        );
      }

      if (w2pError === ErrorType.NoError) {
        w2p_list.forEach((voteStatus) =>
          voteStatus
            ? voteStatusMap.set(
                makeStr(voteStatus.word_to_phrase_translation_id, true, false),
                {
                  translation_id: voteStatus.word_to_phrase_translation_id,
                  from_type_is_word: true,
                  to_type_is_word: false,
                  upvotes: voteStatus.upvotes,
                  downvotes: voteStatus.downvotes,
                },
              )
            : null,
        );
      }

      if (p2wError === ErrorType.NoError) {
        p2w_list.forEach((voteStatus) =>
          voteStatus
            ? voteStatusMap.set(
                makeStr(voteStatus.phrase_to_word_translation_id, false, true),
                {
                  translation_id: voteStatus.phrase_to_word_translation_id,
                  from_type_is_word: false,
                  to_type_is_word: true,
                  upvotes: voteStatus.upvotes,
                  downvotes: voteStatus.downvotes,
                },
              )
            : null,
        );
      }

      if (p2pError === ErrorType.NoError) {
        p2p_list.forEach((voteStatus) =>
          voteStatus
            ? voteStatusMap.set(
                makeStr(
                  voteStatus.phrase_to_phrase_translation_id,
                  false,
                  false,
                ),
                {
                  translation_id: voteStatus.phrase_to_phrase_translation_id,
                  from_type_is_word: false,
                  to_type_is_word: false,
                  upvotes: voteStatus.upvotes,
                  downvotes: voteStatus.downvotes,
                },
              )
            : null,
        );
      }

      return {
        error: ErrorType.NoError,
        vote_status_list: ids.map((id) => {
          const voteStatus = voteStatusMap.get(
            makeStr(
              id.translation_id + '',
              id.from_type_is_word,
              id.to_type_is_word,
            ),
          );

          return voteStatus
            ? voteStatus
            : {
                translation_id: id.translation_id + '',
                from_type_is_word: id.from_type_is_word,
                to_type_is_word: id.to_type_is_word,
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
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      let error: ErrorType = ErrorType.NoError;
      let upvotes = 0;
      let downvotes = 0;

      if (from_type_is_word && to_type_is_word) {
        const { error: w2wError, vote_status } =
          await this.w2wTrService.toggleVoteStatus(
            translation_id + '',
            vote,
            token,
            pgClient,
          );

        error = w2wError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (from_type_is_word && !to_type_is_word) {
        const { error: w2pError, vote_status } =
          await this.w2pTrService.toggleVoteStatus(
            translation_id,
            vote,
            token,
            pgClient,
          );

        error = w2pError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (!from_type_is_word && to_type_is_word) {
        const { error: p2wError, vote_status } =
          await this.p2wTrService.toggleVoteStatus(
            translation_id,
            vote,
            token,
            pgClient,
          );

        error = p2wError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      } else if (!from_type_is_word && !to_type_is_word) {
        const { error: p2pError, vote_status } =
          await this.p2pTrService.toggleVoteStatus(
            translation_id,
            vote,
            token,
            pgClient,
          );

        error = p2pError;
        upvotes = vote_status?.upvotes || 0;
        downvotes = vote_status?.downvotes || 0;
      }

      return {
        error,
        vote_status: {
          translation_id: translation_id + '',
          from_type_is_word,
          to_type_is_word,
          upvotes,
          downvotes,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
