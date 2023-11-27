import { useCallback, useEffect, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, LinearProgress } from '@mui/material';

import {
  ErrorType,
  TableNameType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
  useGetTranslationsByFromDefinitionIdQuery,
} from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { TextCard } from '../../common/TextCard';
import { useToggleTranslationVoteStatusWithRefetchMutation } from '../../../hooks/useToggleTranslationVoteStatusMutation';

export type PericopeTranslationListProps = {
  pericope_id: string;
  tempTranslation?: string;
};

export function PericopeTranslationList({
  pericope_id,
  tempTranslation,
}: PericopeTranslationListProps) {
  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { updatedTrDefinitionIds },
      },
    },
    actions: { setUpdatedTrDefinitionIds },
  } = useAppContext();
  const { getTransformedTranslations } = useMapTranslationTools();
  const [origAndTr, setOrigAndTr] = useState<{
    original: Original | null;
    translations: Translation[];
  } | null>(null);

  const [present] = useIonToast();

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  }).data?.getMapWordOrPhraseAsOrigByDefinitionId.wordOrPhrase;

  const translationsQ = useGetTranslationsByFromDefinitionIdQuery({
    variables: {
      definition_id,
      from_definition_type_is_word: definition_type === 'word',
      language_code: targetLang?.lang.tag || '',
      dialect_code: targetLang?.dialect?.tag,
      geo_code: targetLang?.region?.tag,
    },
    fetchPolicy: 'no-cache',
  }).data?.getTranslationsByFromDefinitionId.translation_with_vote_list;

  useEffect(() => {
    if (!wordOrPhraseQ || !translationsQ) return;
    const t = getTransformedTranslations(wordOrPhraseQ, translationsQ);
    if (!t?.original) return;
    setOrigAndTr(t);
  }, [getTransformedTranslations, translationsQ, wordOrPhraseQ]);

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useToggleTranslationVoteStatusWithRefetchMutation();

  useEffect(() => {
    if (voteLoading) return;
    if (
      voteData &&
      voteData?.toggleTranslationVoteStatus.error !== ErrorType.NoError
    ) {
      present({
        message: voteData?.toggleTranslationVoteStatus.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, voteData, voteLoading]);

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
      });
      setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);
    },
    [
      definition_id,
      setUpdatedTrDefinitionIds,
      toggleTrVoteStatus,
      updatedTrDefinitionIds,
    ],
  );

  return (
    <Stack gap="24px">
      {!origAndTr?.original ? (
        <LinearProgress />
      ) : (
        origAndTr.translations.map((item) => {
          if (tempTranslation && tempTranslation !== item.value) {
            return null;
          }

          return (
            <TextCard
              key={item.key}
              text={item.value}
              description={item.definition}
              discussion={{
                parent_id: item.parent.id,
                parent_table: item.parent.table,
              }}
              author={item.author}
              flags={{
                parent_table:
                  item.to_type === 'word'
                    ? TableNameType.WordDefinitions
                    : TableNameType.PhraseDefinitions,
                parent_id: item.definition_id!,
                flag_names: WORD_AND_PHRASE_FLAGS,
              }}
              vote={{
                upVotes: item.upvotes,
                downVotes: item.downvotes,
                onVoteUpClick: () => {
                  handleVoteClick(
                    item.id,
                    origAndTr.original!.isWord,
                    item.to_type === 'word',
                    true,
                  );
                },
                onVoteDownClick: () => {
                  handleVoteClick(
                    item.id,
                    origAndTr.original!.isWord,
                    item.to_type === 'word',
                    false,
                  );
                },
              }}
            />
          );
        })
      )}
    </Stack>
  );
}
