import { Stack, LinearProgress } from '@mui/material';

import {
  ErrorType,
  FlagType,
  PericopeTranslationWithVotes,
  TableNameType,
} from '../../../generated/graphql';

import { TextCard } from '../../common/TextCard';
import { useCallback, useEffect } from 'react';
import { useIonToast } from '@ionic/react';
import { useTogglePericopeTrVoteStatusMutation } from '../../../hooks/useTogglePericopeTrVoteStatusMutation';
import { useVotePericopeTrChangedSubscription } from '../../../hooks/useVotePericopeTrChangedSubscription';

export type PericopeTranslationListProps = {
  translations: PericopeTranslationWithVotes[];
};

export function PericopeTranslationList({
  translations,
}: PericopeTranslationListProps) {
  const [present] = useIonToast();

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useTogglePericopeTrVoteStatusMutation();

  useVotePericopeTrChangedSubscription();

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
      {!translations ? (
        <LinearProgress />
      ) : (
        translations.map((tr) => {
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
              isStarred={tr.isBest || undefined}
              discussion={{
                parent_table: TableNameType.PericopeTranslations,
                parent_id: tr.pericope_translation_id,
              }}
              flags={{
                flag_names: [
                  {
                    label: 'FastTranslation',
                    flag: FlagType.FastTranslation,
                    role: 'admin-only',
                  },
                ],
                parent_id: tr.pericope_translation_id,
                parent_table: TableNameType.PericopeTranslations,
              }}
            />
          );
        })
      )}
    </Stack>
  );
}
