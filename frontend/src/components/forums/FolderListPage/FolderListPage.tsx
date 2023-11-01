import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Typography, Button } from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import { useGetForumFoldersLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { FolderModal } from '../modals/FolderModal';
import { FolderItem } from './FolderItem';

export function FolderListPage() {
  const { tr } = useTr();
  const { forum_id, forum_name } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    forum_id: string;
    forum_name: string;
  }>();

  const [filter, setFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getFolders, { data: foldersData, error }] =
    useGetForumFoldersLazyQuery();

  useEffect(() => {
    getFolders({
      variables: {
        forum_id: forum_id,
      },
    });
  }, [getFolders, forum_id]);

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!foldersData || foldersData.forumFolders.error !== ErrorType.NoError) {
      return null;
    }

    return foldersData.forumFolders.folders.map((folder) => (
      <FolderItem
        key={folder.folder_id}
        forum_id={forum_id}
        id={folder.folder_id}
        name={folder.name}
        description="Lorem ipsum is placeholder text used in the graphic, print, and publishing."
        totalThreads={47}
        totalPosts={500}
      />
    ));
  }, [error, foldersData, forum_id]);

  const handleOpenModal = () => {
    openModal(<FolderModal forum_id={forum_id} onClose={closeModal} />);
  };

  return (
    <PageLayout>
      <Caption>{forum_name}</Caption>

      <Stack gap="13px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" color="dark">
            {`${3} ${tr('Folders')}`}
          </Typography>

          <Button
            variant="contained"
            color="orange"
            sx={{ padding: '7px', minWidth: 0 }}
            onClick={handleOpenModal}
          >
            <AddCircle sx={{ fontSize: '18px' }} />
          </Button>
        </Stack>
        <SearchInput
          value={filter}
          onChange={setFilter}
          onClickSearchButton={() => {}}
          placeholder={tr('Search by...')}
        />
      </Stack>

      <Stack gap="16px">{cardListComs}</Stack>
    </PageLayout>
  );
}
