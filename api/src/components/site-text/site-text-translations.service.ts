import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';
import { calc_vote_weight } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';

import { DefinitionsService } from 'src/components/definitions/definitions.service';
import { TranslationsService } from 'src/components/translations/translations.service';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationVotesService } from './site-text-translation-votes.service';
import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import {
  TranslationOutput,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
} from 'src/components/translations/types';

import {
  SiteTextTranslationVoteStatus,
  SiteTextWordToWordTranslationWithVote,
  SiteTextWordToPhraseTranslationWithVote,
  SiteTextPhraseToWordTranslationWithVote,
  SiteTextPhraseToPhraseTranslationWithVote,
  SiteTextTranslationWithVoteOutput,
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationWithVoteListFromIdsOutput,
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextTranslationUpsertInput,
  SiteTextTranslationWithVoteListByLanguage,
  SiteTextTranslationWithVoteListByLanguageOutput,
  SiteTextTranslationWithVoteListByLanguageListOutput,
} from './types';

import {
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
  GetAllSiteTextWordDefinition,
  getAllSiteTextWordDefinition,
  GetDefinitionIdBySiteTextId,
  getDefinitionIdBySiteTextId,
  SiteTextDefinitionTranslationCountUpsertsProcedureOutput,
  callSiteTextDefinitionTranslationCountUpsertsProcedure,
} from './sql-string';

import { makeStr } from 'src/components/translations/translations.service';
import { makeStr as voteMakeStr } from './site-text-translation-votes.service';

@Injectable()
export class SiteTextTranslationsService {
  constructor(
    private pg: PostgresService,
    private definitionService: DefinitionsService,
    private translationService: TranslationsService,
    private siteTextService: SiteTextsService,
    private siteTextWordDefinitionService: SiteTextWordDefinitionsService,
    private siteTextPhraseDefinitionService: SiteTextPhraseDefinitionsService,
    private siteTextTranslationVoteService: SiteTextTranslationVotesService,
  ) {
    // update site_text_definition_translation_counts table after 5 mins
    setTimeout(() => {
      this.updateSiteTextTranslatedInfo(null);
    }, 300000);
  }

  async upsertFromTranslationlikeString(
    fromInput: SiteTextTranslationsFromInput,
    toInput: SiteTextTranslationsToInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
    if (toInput.translationlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        translation: null,
      };
    }

    try {
      const words = toInput.translationlike_string
        .split(' ')
        .filter((w) => w !== '');

      if (words.length > 1) {
        const { error, phrase_definition } =
          await this.definitionService.upsertFromPhraseAndDefinitionlikeString(
            {
              phraselike_string: toInput.translationlike_string.trim(),
              definitionlike_string: toInput.definitionlike_string,
              language_code: toInput.language_code,
              dialect_code: toInput.dialect_code,
              geo_code: toInput.geo_code,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError || phrase_definition === null) {
          return {
            error: error,
            translation: null,
          };
        }

        return this.translationService.upsertTranslation(
          +fromInput.from_definition_id,
          fromInput.from_type_is_word,
          +phrase_definition.phrase_definition_id,
          false,
          token,
          pgClient,
        );
      } else {
        const { error, word_definition } =
          await this.definitionService.upsertFromWordAndDefinitionlikeString(
            {
              wordlike_string: toInput.translationlike_string.trim(),
              definitionlike_string: toInput.definitionlike_string,
              language_code: toInput.language_code,
              dialect_code: toInput.dialect_code,
              geo_code: toInput.geo_code,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError || word_definition === null) {
          return {
            error: error,
            translation: null,
          };
        }

        return this.translationService.upsertTranslation(
          +fromInput.from_definition_id,
          fromInput.from_type_is_word,
          +word_definition.word_definition_id,
          true,
          token,
          pgClient,
        );
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation: null,
    };
  }

  async upsertTranslation(
    input: SiteTextTranslationUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDefinitionIdBySiteTextId>(
        ...getDefinitionIdBySiteTextId(
          +input.site_text_id,
          input.is_word_definition,
        ),
      );

      if (res.rowCount !== 1) {
        console.error(`no site-text-definition for id: ${input.site_text_id}`);
      } else {
        const from_definition_id = res.rows[0].definition_id;
        const from_type_is_word = input.is_word_definition;

        return this.upsertFromTranslationlikeString(
          {
            from_definition_id: from_definition_id + '',
            from_type_is_word,
          },
          {
            translationlike_string: input.translationlike_string,
            definitionlike_string: input.definitionlike_string,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          },
          token,
          pgClient,
        );
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation: null,
    };
  }

  async getAllTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    try {
      let from_definition_id: number;

      if (site_text_type_is_word) {
        const { error, site_text_word_definition } =
          await this.siteTextWordDefinitionService.read(site_text_id, pgClient);

        if (error !== ErrorType.NoError || !site_text_word_definition) {
          return {
            error: error,
            site_text_translation_with_vote_list: [],
          };
        } else {
          from_definition_id =
            +site_text_word_definition.word_definition.word_definition_id;
        }
      } else {
        const { error, site_text_phrase_definition } =
          await this.siteTextPhraseDefinitionService.read(
            site_text_id,
            pgClient,
          );

        if (error !== ErrorType.NoError || !site_text_phrase_definition) {
          return {
            error: error,
            site_text_translation_with_vote_list: [],
          };
        } else {
          from_definition_id =
            +site_text_phrase_definition.phrase_definition.phrase_definition_id;
        }
      }

      const { error, translation_with_vote_list } =
        await this.translationService.getTranslationsByFromDefinitionId(
          from_definition_id,
          site_text_type_is_word,
          {
            language_code,
            dialect_code,
            geo_code,
          },
          pgClient,
        );

      if (error !== ErrorType.NoError || translation_with_vote_list === null) {
        return {
          error,
          site_text_translation_with_vote_list: [],
        };
      }

      const translationVoteIds = translation_with_vote_list
        .map((translation) => {
          if ((translation as any)?.word_to_word_translation_id) {
            return {
              translation_id: +(translation as WordToWordTranslationWithVote)
                .word_to_word_translation_id,
              from_type_is_word: true,
              to_type_is_word: true,
            };
          } else if ((translation as any)?.word_to_phrase_translation_id) {
            return {
              translation_id: +(translation as WordToPhraseTranslationWithVote)
                .word_to_phrase_translation_id,
              from_type_is_word: true,
              to_type_is_word: false,
            };
          } else if ((translation as any)?.phrase_to_word_translation_id) {
            return {
              translation_id: +(translation as PhraseToWordTranslationWithVote)
                .phrase_to_word_translation_id,
              from_type_is_word: false,
              to_type_is_word: true,
            };
          } else if ((translation as any)?.phrase_to_phrase_translation_id) {
            return {
              translation_id: +(
                translation as PhraseToPhraseTranslationWithVote
              ).phrase_to_phrase_translation_id,
              from_type_is_word: false,
              to_type_is_word: false,
            };
          }
        })
        .filter((id) => id)
        .map(
          (id: {
            translation_id: number;
            from_type_is_word: boolean;
            to_type_is_word: boolean;
          }) => id,
        );

      const { error: voteError, vote_status_list } =
        await this.siteTextTranslationVoteService.getVoteStatusFromIds(
          translationVoteIds,
          pgClient,
        );

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          site_text_translation_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list: translation_with_vote_list.map(
          (translation, index) => {
            const voteStatus = vote_status_list[index];

            if (!voteStatus || !translation) {
              return null;
            }

            return {
              ...translation,
              upvotes: voteStatus.upvotes,
              downvotes: voteStatus.downvotes,
            };
          },
        ),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: [],
    };
  }

  async getAllTranslationFromSiteTextDefinitionIDs(
    siteTextIds: {
      site_text_id: number;
      site_text_type_is_word: boolean;
    }[],
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteListFromIdsOutput> {
    try {
      const siteTextWordDefinitionIds = siteTextIds
        .filter((siteTextId) => siteTextId.site_text_type_is_word)
        .map((siteTextId) => siteTextId.site_text_id);

      const siteTextPhraseDefinitionIds = siteTextIds
        .filter((siteTextId) => !siteTextId.site_text_type_is_word)
        .map((siteTextId) => siteTextId.site_text_id);

      const { error: wordError, site_text_word_definitions } =
        await this.siteTextWordDefinitionService.reads(
          siteTextWordDefinitionIds,
          pgClient,
        );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          site_text_translation_with_vote_list: [],
        };
      }

      const { error: phraseError, site_text_phrase_definitions } =
        await this.siteTextPhraseDefinitionService.reads(
          siteTextPhraseDefinitionIds,
          pgClient,
        );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          site_text_translation_with_vote_list: [],
        };
      }

      const siteTextDefinitionsMap = new Map<
        string,
        {
          definition_id: number;
          from_definition_type_is_word: boolean;
        }
      >();

      site_text_word_definitions.forEach((stwd) =>
        stwd
          ? siteTextDefinitionsMap.set(makeStr(+stwd.site_text_id, true), {
              definition_id: +stwd.word_definition.word_definition_id,
              from_definition_type_is_word: true,
            })
          : null,
      );

      site_text_phrase_definitions.forEach((stpd) =>
        stpd
          ? siteTextDefinitionsMap.set(makeStr(+stpd.site_text_id, false), {
              definition_id: +stpd.phrase_definition.phrase_definition_id,
              from_definition_type_is_word: false,
            })
          : null,
      );

      const definitionObjIds: {
        definition_id: number;
        from_definition_type_is_word: boolean;
      }[] = [];

      for (const id of siteTextDefinitionsMap.values()) {
        definitionObjIds.push(id);
      }

      const { error, translation_with_vote_list } =
        await this.translationService.getTranslationsByFromDefinitionIds(
          definitionObjIds,
          {
            language_code,
            dialect_code,
            geo_code,
          },
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error,
          site_text_translation_with_vote_list: [],
        };
      }

      const translationsMap = new Map<
        string,
        (
          | WordToWordTranslationWithVote
          | WordToPhraseTranslationWithVote
          | PhraseToWordTranslationWithVote
          | PhraseToPhraseTranslationWithVote
          | null
        )[]
      >();

      const translationVoteIds = translation_with_vote_list
        .reduce((sumOfArr, translations) => [...sumOfArr, ...translations], [])
        .map((translation) => {
          if ((translation as any)?.word_to_word_translation_id) {
            const w2wTranslation = translation as WordToWordTranslationWithVote;
            const key = makeStr(
              +w2wTranslation.from_word_definition.word_definition_id,
              true,
            );

            const translations = translationsMap.get(key);

            if (translations) {
              translations.push(translation);
            } else {
              translationsMap.set(key, [translation]);
            }

            return {
              translation_id: +w2wTranslation.word_to_word_translation_id,
              from_type_is_word: true,
              to_type_is_word: true,
            };
          } else if ((translation as any)?.word_to_phrase_translation_id) {
            const w2pTranslation =
              translation as WordToPhraseTranslationWithVote;
            const key = makeStr(
              +w2pTranslation.from_word_definition.word_definition_id,
              true,
            );

            const translations = translationsMap.get(key);

            if (translations) {
              translations.push(translation);
            } else {
              translationsMap.set(key, [translation]);
            }

            return {
              translation_id: +w2pTranslation.word_to_phrase_translation_id,
              from_type_is_word: true,
              to_type_is_word: false,
            };
          } else if ((translation as any)?.phrase_to_word_translation_id) {
            const p2wTranslation =
              translation as PhraseToWordTranslationWithVote;
            const key = makeStr(
              +p2wTranslation.from_phrase_definition.phrase_definition_id,
              false,
            );

            const translations = translationsMap.get(key);

            if (translations) {
              translations.push(translation);
            } else {
              translationsMap.set(key, [translation]);
            }

            return {
              translation_id: +p2wTranslation.phrase_to_word_translation_id,
              from_type_is_word: false,
              to_type_is_word: true,
            };
          } else if ((translation as any)?.phrase_to_phrase_translation_id) {
            const p2pTranslation =
              translation as PhraseToPhraseTranslationWithVote;
            const key = makeStr(
              +p2pTranslation.from_phrase_definition.phrase_definition_id,
              false,
            );

            const translations = translationsMap.get(key);

            if (translations) {
              translations.push(translation);
            } else {
              translationsMap.set(key, [translation]);
            }

            return {
              translation_id: +p2pTranslation.phrase_to_phrase_translation_id,
              from_type_is_word: false,
              to_type_is_word: false,
            };
          }
        })
        .filter((id) => id)
        .map(
          (id: {
            translation_id: number;
            from_type_is_word: boolean;
            to_type_is_word: boolean;
          }) => id,
        );

      const { error: voteError, vote_status_list } =
        await this.siteTextTranslationVoteService.getVoteStatusFromIds(
          translationVoteIds,
          pgClient,
        );

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          site_text_translation_with_vote_list: [],
        };
      }

      const voteStatusMap = new Map<string, SiteTextTranslationVoteStatus>();

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? voteStatusMap.set(
              voteMakeStr(
                voteStatus.translation_id + '',
                voteStatus.from_type_is_word,
                voteStatus.to_type_is_word,
              ),
              voteStatus,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list: siteTextIds
          .map((ids) =>
            siteTextDefinitionsMap.get(
              makeStr(ids.site_text_id, ids.site_text_type_is_word),
            ),
          )
          .map((ids) => {
            if (!ids) {
              return [];
            }

            const translations = translationsMap.get(
              makeStr(ids.definition_id, ids.from_definition_type_is_word),
            );

            if (!translations) {
              return [];
            }

            return translations.map((translation) => {
              let voteStatus: SiteTextTranslationVoteStatus | undefined =
                undefined;

              if ((translation as any)?.word_to_word_translation_id) {
                voteStatus = voteStatusMap.get(
                  voteMakeStr(
                    (translation as WordToWordTranslationWithVote)
                      .word_to_word_translation_id,
                    true,
                    true,
                  ),
                );
              } else if ((translation as any)?.word_to_phrase_translation_id) {
                voteStatus = voteStatusMap.get(
                  voteMakeStr(
                    (translation as WordToPhraseTranslationWithVote)
                      .word_to_phrase_translation_id,
                    true,
                    false,
                  ),
                );
              } else if ((translation as any)?.phrase_to_word_translation_id) {
                voteStatus = voteStatusMap.get(
                  voteMakeStr(
                    (translation as PhraseToWordTranslationWithVote)
                      .phrase_to_word_translation_id,
                    false,
                    true,
                  ),
                );
              } else if (
                (translation as any)?.phrase_to_phrase_translation_id
              ) {
                voteStatus = voteStatusMap.get(
                  voteMakeStr(
                    (translation as PhraseToPhraseTranslationWithVote)
                      .phrase_to_phrase_translation_id,
                    false,
                    false,
                  ),
                );
              }

              return {
                ...translation,
                upvotes: voteStatus ? voteStatus.upvotes : 0,
                downvotes: voteStatus ? voteStatus.downvotes : 0,
              } as
                | SiteTextWordToWordTranslationWithVote
                | SiteTextWordToPhraseTranslationWithVote
                | SiteTextPhraseToWordTranslationWithVote
                | SiteTextPhraseToPhraseTranslationWithVote;
            });
          }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: [],
    };
  }

  async getRecommendedTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteOutput> {
    try {
      const { error, site_text_translation_with_vote_list } =
        await this.getAllTranslationFromSiteTextDefinitionID(
          site_text_id,
          site_text_type_is_word,
          language_code,
          dialect_code,
          geo_code,
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          site_text_translation_with_vote: null,
        };
      }

      let mostVoted:
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
        | null = null;

      for (const translation_with_vote of site_text_translation_with_vote_list) {
        if (!translation_with_vote) {
          continue;
        }

        if (mostVoted !== null) {
          const a = calc_vote_weight(mostVoted.upvotes, mostVoted.downvotes);
          const b = calc_vote_weight(
            translation_with_vote.upvotes,
            translation_with_vote.downvotes,
          );

          if (a > b) {
            continue;
          }
        }

        mostVoted = translation_with_vote;
      }

      if (mostVoted === null) {
        return {
          error: ErrorType.NoError,
          site_text_translation_with_vote: null,
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote: mostVoted,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote: null,
    };
  }

  async getRecommendedTranslationFromSiteTextDefinitionIDs(
    siteTextIds: {
      site_text_id: number;
      site_text_type_is_word: boolean;
    }[],
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    try {
      const { error, site_text_translation_with_vote_list } =
        await this.getAllTranslationFromSiteTextDefinitionIDs(
          siteTextIds,
          language_code,
          dialect_code,
          geo_code,
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          site_text_translation_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list:
          site_text_translation_with_vote_list.map((trList) => {
            let mostVoted:
              | SiteTextWordToWordTranslationWithVote
              | SiteTextWordToPhraseTranslationWithVote
              | SiteTextPhraseToWordTranslationWithVote
              | SiteTextPhraseToPhraseTranslationWithVote
              | null = null;

            for (const translation_with_vote of trList) {
              if (!translation_with_vote) {
                continue;
              }

              if (mostVoted !== null) {
                const a = calc_vote_weight(
                  mostVoted.upvotes,
                  mostVoted.downvotes,
                );
                const b = calc_vote_weight(
                  translation_with_vote.upvotes,
                  translation_with_vote.downvotes,
                );

                if (a > b) {
                  continue;
                }
              }

              mostVoted = translation_with_vote;
            }

            return mostVoted;
          }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: [],
    };
  }

  async getAllRecommendedTranslationListByLanguage(
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteListByLanguageOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextWordDefinition>(...getAllSiteTextWordDefinition());

      const res2 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition(),
      );

      const {
        error: wordError,
        site_text_translation_with_vote_list: word_translation_with_vote_list,
      } = await this.getRecommendedTranslationFromSiteTextDefinitionIDs(
        [
          ...res.rows.map((row) => ({
            site_text_id: +row.site_text_id,
            site_text_type_is_word: true,
          })),
          ...res2.rows.map((row) => ({
            site_text_id: +row.site_text_id,
            site_text_type_is_word: false,
          })),
        ],
        language_code,
        dialect_code,
        geo_code,
        pgClient,
      );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          site_text_translation_with_vote_list_by_language: {
            site_text_translation_with_vote_list: [],
            language_code,
            dialect_code,
            geo_code,
          },
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list_by_language: {
          site_text_translation_with_vote_list: [
            ...word_translation_with_vote_list,
          ],
          language_code,
          dialect_code,
          geo_code,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list_by_language: {
        site_text_translation_with_vote_list: [],
        language_code,
        dialect_code,
        geo_code,
      },
    };
  }

  async getAllRecommendedTranslationList(
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationWithVoteListByLanguageListOutput> {
    try {
      const { error: languageError, site_text_language_list } =
        await this.siteTextService.getAllSiteTextLanguageList(pgClient);

      if (languageError !== ErrorType.NoError || !site_text_language_list) {
        return {
          error: languageError,
          site_text_translation_with_vote_list_by_language_list: null,
        };
      }

      const siteTextTranslationWithVoteListByLanguageList: SiteTextTranslationWithVoteListByLanguage[] =
        [];

      for (const language of site_text_language_list) {
        const { error, site_text_translation_with_vote_list_by_language } =
          await this.getAllRecommendedTranslationListByLanguage(
            language.language_code,
            language.dialect_code,
            language.geo_code,
            pgClient,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list_by_language_list: null,
          };
        }

        siteTextTranslationWithVoteListByLanguageList.push(
          site_text_translation_with_vote_list_by_language,
        );
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list_by_language_list:
          siteTextTranslationWithVoteListByLanguageList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list_by_language_list: null,
    };
  }

  async updateSiteTextTranslatedInfo(
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    try {
      const { error: languageError, site_text_language_list } =
        await this.siteTextService.getAllSiteTextLanguageList(pgClient);

      if (languageError !== ErrorType.NoError || !site_text_language_list) {
        return {
          error: languageError,
        };
      }

      for (const language of site_text_language_list) {
        const upsertInput: {
          site_text_id: number;
          is_word_definition: boolean;
          language_code: string;
          dialect_code: string | null;
          geo_code: string | null;
          count: number;
        }[] = [];

        const res = await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<GetAllSiteTextWordDefinition>(
          ...getAllSiteTextWordDefinition(),
        );

        const siteTextWordDefinitionIds = res.rows.map((row) => ({
          site_text_id: +row.site_text_id,
          site_text_type_is_word: true,
        }));

        const res2 = await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<GetAllSiteTextPhraseDefinition>(
          ...getAllSiteTextPhraseDefinition(),
        );

        const siteTextPhraseDefinitionIds = res2.rows.map((row) => ({
          site_text_id: +row.site_text_id,
          site_text_type_is_word: false,
        }));

        const siteTextIds = [
          ...siteTextWordDefinitionIds,
          ...siteTextPhraseDefinitionIds,
        ];

        const { site_text_translation_with_vote_list } =
          await this.getAllTranslationFromSiteTextDefinitionIDs(
            siteTextIds,
            language.language_code,
            language.dialect_code,
            language.geo_code,
            pgClient,
          );

        for (let i = 0; i < siteTextIds.length; i++) {
          if (!site_text_translation_with_vote_list[i]) {
            continue;
          }

          upsertInput.push({
            site_text_id: siteTextIds[i].site_text_id,
            is_word_definition: siteTextIds[i].site_text_type_is_word,
            language_code: language.language_code,
            dialect_code: language.dialect_code,
            geo_code: language.geo_code,
            count: site_text_translation_with_vote_list[i].length,
          });
        }

        await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<SiteTextDefinitionTranslationCountUpsertsProcedureOutput>(
          ...callSiteTextDefinitionTranslationCountUpsertsProcedure({
            site_text_ids: upsertInput.map((item) => item.site_text_id),
            is_word_definitions: upsertInput.map(
              (item) => item.is_word_definition,
            ),
            language_codes: upsertInput.map((item) => item.language_code),
            dialect_codes: upsertInput.map((item) => item.dialect_code),
            geo_codes: upsertInput.map((item) => item.geo_code),
            counts: upsertInput.map((item) => item.count),
          }),
        );
      }

      return {
        error: ErrorType.NoError,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }
}
