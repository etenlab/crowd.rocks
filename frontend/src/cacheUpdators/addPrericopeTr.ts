import { ApolloCache } from '@apollo/client';

import {
  GetPericopeTranslationsQuery,
  GetPericopeTranslationsDocument,
  PericopeTranslation,
  // LanguageInput,
  PericopeTranslationWithVotes,
  LanguageInput,
} from '../generated/graphql';

export function updateCacheWithAddPrericopeTr(
  cache: ApolloCache<unknown>,
  newPericopeTr: PericopeTranslation,
) {
  cache.updateQuery<GetPericopeTranslationsQuery>(
    {
      query: GetPericopeTranslationsDocument,
      variables: {
        pericopeId: newPericopeTr.pericope_id,
        targetLang: {
          language_code: newPericopeTr.language.language_code,
          dialect_code: newPericopeTr.language.language_code || null,
          geo_code: newPericopeTr.language.language_code || null,
        } as LanguageInput,
      },
    },
    (data) => {
      if (data) {
        const newPericopeTrWithVotes: PericopeTranslationWithVotes = {
          ...newPericopeTr,
          __typename: 'PericopeTranslationWithVotes',
          upvotes: 0,
          downvotes: 0,
        };
        return {
          ...data,
          getPericopeTranslations: {
            ...data.getPericopeTranslations,
            translations: [
              newPericopeTrWithVotes,
              ...data.getPericopeTranslations.translations,
            ],
          },
          // getTranslationsByFromDefinitionId: {
          //   ...data.getTranslationsByFromDefinitionId,
          //   translation_with_vote_list: [
          //     ...translation_with_vote_list,
          //     newTranslationWithVote,
          //   ],
          // },
        };
      } else {
        return data;
      }
    },
  );
}
