import { useCallback, useEffect, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, LinearProgress } from '@mui/material';

import { ErrorType, TableNameType } from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';
import {
  useMapTranslationTools,
  Original,
  Translation,
} from '../hooks/useMapTranslationTools';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { WordCard } from '../../common/WordCard';
import { useToggleTranslationVoteStatusWithRefetchMutation } from '../../../hooks/useToggleTranslationVoteStatusMutation';

export type MapWordOrPhraseTranslationListProps = {
  definition_id: string;
  definition_type: string;
  tempTranslation?: string;
};

export function MapWordOrPhraseTranslationList({
  definition_id,
  definition_type,
  tempTranslation,
}: MapWordOrPhraseTranslationListProps) {
  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { updatedTrDefinitionIds },
      },
    },
    actions: { setUpdatedTrDefinitionIds },
  } = useAppContext();
  const { getTranslationsFromDefinitionId } = useMapTranslationTools();
  const [translations, setTranslations] = useState<{
    original: Original;
    translations: Translation[];
  } | null>(null);

  const [present] = useIonToast();

  useEffect(() => {
    if (targetLang) {
      (async () => {
        const { original, translations } =
          await getTranslationsFromDefinitionId(
            definition_id,
            definition_type,
            targetLang,
          );

        setTranslations({ original, translations });
      })();
    }
  }, [
    definition_id,
    definition_type,
    getTranslationsFromDefinitionId,
    targetLang,
  ]);

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
      {!translations ? (
        <LinearProgress />
      ) : (
        translations.translations.map((item) => {
          if (tempTranslation && tempTranslation !== item.value) {
            return null;
          }

          return (
            <WordCard
              key={item.key}
              word={item.value}
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
                    translations.original.isWord,
                    item.to_type === 'word',
                    true,
                  );
                },
                onVoteDownClick: () => {
                  handleVoteClick(
                    item.id,
                    translations.original.isWord,
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
