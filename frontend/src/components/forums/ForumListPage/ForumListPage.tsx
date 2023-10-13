import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useIonToast } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import { useGetForumsLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { CardListContainer, CardContainer } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { NewForumForm } from '../forms/NewForumForm';
import { useForumUpdateMutation } from '../../../hooks/useForumUpsertMutation';

interface ForumListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function ForumListPage({ match }: ForumListPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [present] = useIonToast();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [getForums, { data: forumsData, error }] = useGetForumsLazyQuery();

  const [upsertForum] = useForumUpdateMutation();

  useEffect(() => {
    getForums();
  }, [getForums]);

  const handleGoToForumDetail = useCallback(
    (forumId: string, forum_name: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/forums/${forumId}/${forum_name}`,
      );
    },
    [match.params.language_id, match.params.nation_id, router],
  );

  const handleEdit = useCallback(
    (forum_id: string, newValue: string) => {
      console.log(`'handle edit' ${newValue}`);
      upsertForum({ variables: { id: forum_id, name: newValue } });
    },
    [upsertForum],
  );

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!forumsData || forumsData.forums.error !== ErrorType.NoError) {
      return null;
    }

    return forumsData.forums.forums.map((forum) => (
      <CardContainer key={forum.forum_id}>
        <Card
          key={forum.forum_id}
          content={forum.name}
          //TODO: description=....
          onClick={() => handleGoToForumDetail(forum.forum_id, forum.name)}
          onContentEdit={(newValue) => handleEdit(forum.forum_id, newValue)}
        />
      </CardContainer>
    ));
  }, [error, forumsData, handleEdit, handleGoToForumDetail]);

  return (
    <PageLayout>
      <Caption>{tr('Community')}</Caption>

      <AddListHeader
        title={tr('Forums')}
        onClick={() => {
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Forum')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <NewForumForm
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
