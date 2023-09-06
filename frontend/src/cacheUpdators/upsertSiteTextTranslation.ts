import { ApolloCache } from '@apollo/client';

import {
  Translation,
  SiteTextTranslationWithVote,
  GetAllTranslationFromSiteTextDefinitionIdQuery,
} from '../generated/graphql';
import { GetAllTranslationFromSiteTextDefinitionIdDocument } from '../generated/graphql';

export function updateCacheWithUpsertSiteTextTranslation(
  cache: ApolloCache<unknown>,
  data: {
    newTranslation: Translation;
    site_text_id: number;
    site_text_type_is_word: boolean;
    langInfo: LanguageInfo;
  },
) {
  const { newTranslation, site_text_id, site_text_type_is_word, langInfo } =
    data;

  cache.updateQuery<GetAllTranslationFromSiteTextDefinitionIdQuery>(
    {
      query: GetAllTranslationFromSiteTextDefinitionIdDocument,
      variables: {
        site_text_id: site_text_id + '',
        site_text_type_is_word,
        language_code: langInfo.lang.tag,
      },
    },
    (data) => {
      if (
        data &&
        data.getAllTranslationFromSiteTextDefinitionID
          .site_text_translation_with_vote_list
      ) {
        const alreadyExists =
          data.getAllTranslationFromSiteTextDefinitionID.site_text_translation_with_vote_list.filter(
            (site_text_translation_with_vote) => {
              if (site_text_translation_with_vote) {
                switch (site_text_translation_with_vote.__typename) {
                  case 'SiteTextWordToWordTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'WordToWordTranslation' &&
                      site_text_translation_with_vote.word_to_word_translation_id ===
                        newTranslation.word_to_word_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'SiteTextWordToPhraseTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'WordToPhraseTranslation' &&
                      site_text_translation_with_vote.word_to_phrase_translation_id ===
                        newTranslation.word_to_phrase_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'SiteTextPhraseToWordTranslationWithVote': {
                    if (
                      newTranslation.__typename === 'PhraseToWordTranslation' &&
                      site_text_translation_with_vote.phrase_to_word_translation_id ===
                        newTranslation.phrase_to_word_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                  case 'SiteTextPhraseToPhraseTranslationWithVote': {
                    if (
                      newTranslation.__typename ===
                        'PhraseToPhraseTranslation' &&
                      site_text_translation_with_vote.phrase_to_phrase_translation_id ===
                        newTranslation.phrase_to_phrase_translation_id
                    ) {
                      return true;
                    }

                    return false;
                  }
                }
              }
              return false;
            },
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        let newTypeName:
          | 'SiteTextWordToWordTranslationWithVote'
          | 'SiteTextWordToPhraseTranslationWithVote'
          | 'SiteTextPhraseToWordTranslationWithVote'
          | 'SiteTextPhraseToPhraseTranslationWithVote'
          | undefined;

        switch (newTranslation.__typename) {
          case 'WordToWordTranslation': {
            newTypeName = 'SiteTextWordToWordTranslationWithVote';
            break;
          }
          case 'WordToPhraseTranslation': {
            newTypeName = 'SiteTextWordToPhraseTranslationWithVote';
            break;
          }
          case 'PhraseToWordTranslation': {
            newTypeName = 'SiteTextPhraseToWordTranslationWithVote';
            break;
          }
          case 'PhraseToPhraseTranslation': {
            newTypeName = 'SiteTextPhraseToPhraseTranslationWithVote';
            break;
          }
        }

        if (!newTypeName) {
          return data;
        }

        return {
          ...data,
          getAllTranslationFromSiteTextDefinitionID: {
            ...data.getAllTranslationFromSiteTextDefinitionID,
            site_text_translation_with_vote_list: [
              ...data.getAllTranslationFromSiteTextDefinitionID
                .site_text_translation_with_vote_list,
              {
                ...newTranslation,
                __typename: newTypeName,
                upvotes: 0,
                downvotes: 0,
              } as SiteTextTranslationWithVote,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
