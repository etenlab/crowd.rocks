import { useCallback, useEffect } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, LinearProgress } from '@mui/material';

import { ErrorType } from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';

import { TextCard } from '../../common/TextCard';
import { langInfo2langInput } from '../../../../../utils/dist';
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
      },
    },
  } = useAppContext();
  const [present] = useIonToast();

  const translationsQ = useGetPericopeTranslationsQuery({
    variables: {
      pericope_id,
      targetLang: targetLang
        ? langInfo2langInput(targetLang)
        : { language_code: '' },
    },
    fetchPolicy: 'no-cache',
  }).data?.getTranslationsByFromDefinitionId.translation_with_vote_list;

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useTogglePericopeTranslationVoteMutation();

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
    (translation_id: string, vote: boolean): void => {
      toggleTrVoteStatus({
        variables: {
          translation_id,
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
        translationsQ.translations.map((item: any) => {
          if (tempTranslation && tempTranslation !== item.value) {
            return null;
          }

          return (
            <TextCard
              key={item.id}
              text={item.text}
              description={item.descriprion}
              author={item.author}
              vote={{
                upVotes: item.upvotes,
                downVotes: item.downvotes,
                onVoteUpClick: () => {
                  handleVoteClick(item.id, true);
                },
                onVoteDownClick: () => {
                  handleVoteClick(item.id, false);
                },
              }}
            />
          );
        })
      )}
    </Stack>
  );
}
