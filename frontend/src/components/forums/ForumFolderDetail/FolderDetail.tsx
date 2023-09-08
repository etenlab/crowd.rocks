import { useEffect, useMemo, useCallback, useState } from 'react';
import { IonButton, useIonRouter } from '@ionic/react';
import { useIonToast } from '@ionic/react';

import { Card } from '../../common/Card';

import { ErrorType, useGetThreadsLazyQuery } from '../../../generated/graphql';

import { CardListContainer, CardContainer } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { NewThreadForm } from '../forms/NewThreadForm';
import { chatbubblesOutline } from 'ionicons/icons';
import { useThreadUpdateMutation } from '../../../hooks/useThreadUpsertMutation';

interface ForumFolder {
  nation_id: string;
  language_id: string;
  forum_folder_id: string;
}

export function ForumFolder({
  nation_id,
  language_id,
  forum_folder_id,
}: ForumFolder) {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [present] = useIonToast();

  const [getThreads, { data: threadsData, error }] = useGetThreadsLazyQuery();

  const [showAddThread, setShowAddThread] = useState(false);

  const [upsertThread] = useThreadUpdateMutation(forum_folder_id);

  useEffect(() => {
    getThreads({ variables: { folder_id: forum_folder_id } });
  }, [getThreads, forum_folder_id]);

  const handleGoToThreadDetail = useCallback(
    (threadId: string, threadName: string) => {
      router.push(
        `/${nation_id}/${language_id}/1/discussion/threads/${threadId}/${threadName}`,
      );
    },
    [language_id, nation_id, router],
  );

  const handleEdit = useCallback(
    (thread_id: string, newValue: string) => {
      upsertThread({
        variables: {
          thread_id: thread_id,
          name: newValue,
          folder_id: forum_folder_id,
        },
      });
    },
    [forum_folder_id, upsertThread],
  );

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!threadsData || threadsData.threads.error !== ErrorType.NoError) {
      return null;
    }
    return threadsData.threads.threads.map((thread) => (
      <CardContainer key={thread.thread_id}>
        <Card
          key={thread.thread_id}
          content={thread.name}
          contentIcon={chatbubblesOutline}
          onClick={() => handleGoToThreadDetail(thread.thread_id, thread.name)}
          onContentEdit={(newValue) => handleEdit(thread.thread_id, newValue)}
        />
      </CardContainer>
    ));
  }, [error, threadsData, handleGoToThreadDetail, handleEdit]);

  return (
    <>
      <CardListContainer>
        {cardListComs}
        {showAddThread && (
          <NewThreadForm
            folder_id={forum_folder_id}
            onCreated={() => {
              setShowAddThread(false);
            }}
            onCancel={() => {
              setShowAddThread(false);
            }}
          />
        )}
        {!showAddThread && (
          <IonButton fill="clear" onClick={() => setShowAddThread(true)}>
            {tr('Add Thread...')}
          </IonButton>
        )}
      </CardListContainer>
    </>
  );
}
