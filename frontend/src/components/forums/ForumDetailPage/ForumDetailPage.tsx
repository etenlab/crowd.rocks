import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { useGetForumFoldersLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { CardListContainer, CardContainer } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { AddListHeader } from '../../common/ListHeader';
import { NewFolderForm } from '../forms/NewFolderForm';
import { useForumFolderUpdateMutation } from '../../../hooks/useFolderUpsertMutation';
import { ForumFolder } from '../ForumFolderDetail/FolderDetail';
import { folderOutline } from 'ionicons/icons';
import { EditableText } from '../../common/EditableText/EditableText';

interface ForumDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    forum_id: string;
    forum_name: string;
  }> {}

export function ForumDetailPage({ match }: ForumDetailPageProps) {
  const { tr } = useTr();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!foldersData || foldersData.forumFolders.error !== ErrorType.NoError) {
      return null;
    }

    return foldersData.forumFolders.folders.map((folder) => (
      <CardContainer key={folder.folder_id}>
        <IonTitle>
          <div style={{ display: 'flex' }}>
            <IonIcon
              icon={folderOutline}
              style={{ marginRight: '15px', marginBottom: '-3px' }}
            />
            <EditableText
              text={folder.name}
              onTextEdit={(newVal) => handleEdit(folder.folder_id, newVal)}
            />
          </div>
        </IonTitle>

        <hr />
        <ForumFolder
          key={folder.folder_id}
          nation_id={match.params.nation_id}
          language_id={match.params.language_id}
          forum_folder_id={folder.folder_id}
        />
      </CardContainer>
    ));
  }, [
    error,
    foldersData,
    handleEdit,
    match.params.language_id,
    match.params.nation_id,
  ]);

  return (
    <PageLayout>
      <Caption>{tr('Forum Folders')}</Caption>

      <AddListHeader
        baseIcon={folderOutline}
        title={tr(`${match.params.forum_name ?? ''}`)}
        onClick={() => {
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
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
