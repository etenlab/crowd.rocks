import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useIonToast } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import { ErrorType, useGetThreadsLazyQuery } from '../../../generated/graphql';

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { NewThreadForm } from '../forms/NewThreadForm';
import { chatbubblesOutline } from 'ionicons/icons';

interface ForumFolderDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    forum_folder_id: string;
    forum_folder_name: string;
  }> {}

export function ForumFolderDetailPage({ match }: ForumFolderDetailPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [present] = useIonToast();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [getThreads, { data: threadsData, error }] = useGetThreadsLazyQuery();

  useEffect(() => {
    getThreads({ variables: { folder_id: match.params.forum_folder_id } });
  }, [getThreads, match.params.forum_folder_id]);

  const handleGoToThreadDetail = useCallback(
    (threadId: string, threadName: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/discussion/threads/${threadId}/${threadName}`,
      );
    },
    [match.params.language_id, match.params.nation_id, router],
  );

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!threadsData || threadsData.threads.error !== ErrorType.NoError) {
      return null;
    }
    // TODO: make a cool generic function sort<T>() that can sort on any keyof T
    // we already have another sort function for sitetext that essentially does the
    // same thing as this, just with a different key.
    return threadsData.threads.threads.map((thread) => (
      <CardContainer key={thread.thread_id}>
        <Card
          key={thread.thread_id}
          content={
            <div>
              <IonIcon
                icon={chatbubblesOutline}
                style={{ paddingRight: '15px' }}
              />
              {thread.name}
            </div>
          }
          //TODO: description=....
          onClick={() => handleGoToThreadDetail(thread.thread_id, thread.name)}
        />
      </CardContainer>
    ));
  }, [error, threadsData, handleGoToThreadDetail]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Folder Threads')}</Caption>
      </CaptionContainer>

      <AddListHeader
        title={`${match.params.forum_folder_name ?? ''} Threads`}
        onClick={() => {
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Thread')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <NewThreadForm
            folder_id={match.params.forum_folder_id}
            onCreated={() => {
              setIsOpenModal(false);
            }}
            onCancel={() => {
              setIsOpenModal(false);
            }}
          />
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
