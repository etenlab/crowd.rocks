import { Stack, LinearProgress } from '@mui/material';

import {
  ErrorType,
  useGetPericopeTranslationsQuery,
  useTogglePericopeTrVoteStatusMutation,
} from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';

import { TextCard } from '../../common/TextCard';
import { langInfo2langInput } from '../../../../../utils';
import { useCallback, useEffect } from 'react';
import { useIonToast } from '@ionic/react';
export type PericopeTranslationListProps = {
  pericope_id: string;
  tempTranslation?: string;
};

export function PericopeTranslationList({
  pericope_id,
}: PericopeTranslationListProps) {
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const translationsQ = useGetPericopeTranslationsQuery({
    variables: {
      pericopeId: pericope_id,
      targetLang: targetLang
        ? langInfo2langInput(targetLang)
        : { language_code: '' },
    },
    fetchPolicy: 'no-cache',
  }).data?.getPericopeTranslations;

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useTogglePericopeTrVoteStatusMutation();

  useEffect(() => {
    if (voteLoading) return;
    if (
      voteData &&
      voteData?.togglePericopeTrVoteStatus.error !== ErrorType.NoError
    ) {
      present({
        message: voteData?.togglePericopeTrVoteStatus.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, voteData, voteLoading]);

  const handleVoteClick = useCallback(
    (pericope_translation_id: string, vote: boolean): void => {
      toggleTrVoteStatus({
        variables: {
          pericope_translation_id,
          vote,
        },
      });
    },
    [toggleTrVoteStatus],
  );

  return (
    <Stack gap="24px">
      {!translationsQ ? (
        <LinearProgress />
      ) : (
        // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
        translationsQ.translations.map((tr) => {
          // if (tempTranslation && tempTranslation !== item.value) {
          //   return null;
          // }

          return (
            <TextCard
              key={tr.pericope_translation_id}
              text={tr.translation}
              description={tr.translation_description || ''}
              author={{
                createdAt: new Date(Number(tr.created_at)),
                username: tr.created_by_user.avatar,
                avatar: tr.created_by_user.avatar,
                createdByBot: tr.created_by_user.is_bot,
              }}
              vote={{
                upVotes: tr.upvotes,
                downVotes: tr.downvotes,
                onVoteUpClick: () => {
                  handleVoteClick(tr.pericope_translation_id, true);
                },
                onVoteDownClick: () => {
                  handleVoteClick(tr.pericope_translation_id, false);
                },
              }}
            />
          );
        })
      )}
    </Stack>
  );
}
