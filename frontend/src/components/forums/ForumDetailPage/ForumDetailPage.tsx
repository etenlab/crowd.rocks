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

import { useGetForumFoldersLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { NewFolderForm } from '../forms/NewFolderForm';
import { folderOutline } from 'ionicons/icons';
import { useForumFolderUpdateMutation } from '../../../hooks/useFolderUpsertMutation';

interface ForumDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    forum_id: string;
    forum_name: string;
  }> {}

export function ForumDetailPage({ match }: ForumDetailPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [present] = useIonToast();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [getFolders, { data: foldersData, error }] =
    useGetForumFoldersLazyQuery();

  const [upsertFolder] = useForumFolderUpdateMutation(match.params.forum_id);

  useEffect(() => {
    getFolders({
      variables: {
        forum_id: match.params.forum_id,
      },
    });
  }, [getFolders, match.params.forum_id]);

  const handleGoToFolderDetail = useCallback(
    (folderId: string, folder_name: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/folders/${folderId}/${folder_name}`,
      );
    },
    [match.params.language_id, match.params.nation_id, router],
  );

  const handleEdit = useCallback(
    (folder_id: string, newValue: string) => {
      upsertFolder({
        variables: {
          id: folder_id,
          name: newValue,
          forum_id: match.params.forum_id,
        },
      });
    },
    [match.params.forum_id, upsertFolder],
  );
  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!foldersData || foldersData.forumFolders.error !== ErrorType.NoError) {
      return null;
    }

    return foldersData.forumFolders.folders.map((folder) => (
      <CardContainer key={folder.folder_id}>
        <Card
          key={folder.folder_id}
          content={folder.name}
          contentIcon={folderOutline}
          //TODO: description=....
          onClick={() => handleGoToFolderDetail(folder.folder_id, folder.name)}
          onContentEdit={(newValue) => handleEdit(folder.folder_id, newValue)}
        />
      </CardContainer>
    ));
  }, [error, foldersData, handleEdit, handleGoToFolderDetail]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Forum Folders')}</Caption>
      </CaptionContainer>

      <AddListHeader
        title={tr(`${match.params.forum_name ?? ''} Folders`)}
        onClick={() => {
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Folder')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <NewFolderForm
            forum_id={match.params.forum_id}
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
