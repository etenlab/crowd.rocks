import { useCallback, useMemo } from 'react';
import { Stack, CircularProgress } from '@mui/material';

import {
  TableNameType,
  useGetTranslationsByFromDefinitionIdQuery,
  GetRecommendedTranslationFromDefinitionIdDocument,
} from '../../../generated/graphql';

import { useTranslationTools } from '../hooks/useTranslationTools';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { TextCard } from '../../common/TextCard';
import { useToggleTranslationVoteStatusMutation } from '../../../hooks/useToggleTranslationVoteStatusMutation';
import { StringContentTypes } from '../../../common/utility';

export type TranslationListProps = {
  definition_id: string;
  definition_type: string;
  tempTranslation?: string;
  targetLang: LanguageInfo;
};

export function TranslationList({
  definition_id,
  definition_type,
  tempTranslation,
  targetLang,
}: TranslationListProps) {
  const { getTransformedTranslations } = useTranslationTools();

  const { data, loading } = useGetTranslationsByFromDefinitionIdQuery({
    variables: {
      definition_id,
      from_definition_type_is_word: definition_type === StringContentTypes.WORD,
      language_code: targetLang?.lang.tag || '',
      dialect_code: targetLang?.dialect?.tag || null,
      geo_code: targetLang?.region?.tag || null,
    },
  });

  const [toggleTrVoteStatus] = useToggleTranslationVoteStatusMutation();

  const handleVoteClick = useCallback(
    (
      translation_id: string,
      from_definition_type_is_word: boolean,
      to_definition_type_is_word: boolean,
      vote: boolean,
    ): void => {
      toggleTrVoteStatus({
        variables: {
          from_definition_type_is_word,
          to_definition_type_is_word,
          translation_id,
          vote,
        },
        refetchQueries: [GetRecommendedTranslationFromDefinitionIdDocument],
      });
    },
    [toggleTrVoteStatus],
  );

  const translations = useMemo(() => {
    if (!data?.getTranslationsByFromDefinitionId.translation_with_vote_list) {
      return [];
    } else {
      const { translations } = getTransformedTranslations(
        null,
        data?.getTranslationsByFromDefinitionId.translation_with_vote_list,
      );
      return translations;
    }
  }, [getTransformedTranslations, data]);

  return (
    <Stack gap="24px">
      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : null}
      {translations.map((item) => {
        if (
          tempTranslation &&
          tempTranslation !== item.wordOrPhrase.likeString
        ) {
          return null;
        }

        return (
          <TextCard
            key={item.key}
            text={item.wordOrPhrase.likeString}
            description={item.definition.likeString}
            discussion={{
              parent_id: item.translation.id,
              parent_table: item.translation.tableName,
            }}
            author={item.author}
            flags={{
              parent_table: item.toDefinitionIsWord
                ? TableNameType.WordDefinitions
                : TableNameType.PhraseDefinitions,
              parent_id: item.definition.id,
              flag_names: WORD_AND_PHRASE_FLAGS,
            }}
            vote={{
              upVotes: item.vote.upvotes,
              downVotes: item.vote.downvotes,
              onVoteUpClick: () => {
                handleVoteClick(
                  item.translation.id,
                  item.fromDefinitionIsWord,
                  item.toDefinitionIsWord,
                  true,
                );
              },
              onVoteDownClick: () => {
                handleVoteClick(
                  item.translation.id,
                  item.fromDefinitionIsWord,
                  item.toDefinitionIsWord,
                  false,
                );
              },
            }}
          />
        );
      })}
    </Stack>
  );
}
