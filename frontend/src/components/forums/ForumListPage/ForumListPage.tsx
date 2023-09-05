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

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { NewForumForm } from '../forms/NewForumForm';

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

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!forumsData || forumsData.forums.error !== ErrorType.NoError) {
      return null;
    }
    // TODO: make a cool generic function sort<T>() that can sort on any keyof T
    // we already have another sort function for sitetext that essentially does the
    // same thing as this, just with a different key.
    return forumsData.forums.forums.map((forum) => (
      <CardContainer key={forum.forum_id}>
        <Card
          key={forum.forum_id}
          content={forum.name}
          //TODO: description=....
          onClick={() => handleGoToForumDetail(forum.forum_id, forum.name)}
        />
      </CardContainer>
    ));
  }, [error, forumsData, handleGoToForumDetail]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Community')}</Caption>
      </CaptionContainer>

      <AddListHeader
        title={tr('Forums')}
        onClick={() => {
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
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
