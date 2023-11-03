import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import {
  Stack,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import { useGetForumFoldersListLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { FolderModal } from '../modals/FolderModal';
import { FolderItem } from './FolderItem';

import { PAGE_SIZE } from '../../../const/commonConst';

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
    actions: { createModal, addPaginationVariableForGetForumFoldersList },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [
    getForumFoldersList,
    { data: foldersData, error, loading, fetchMore },
  ] = useGetForumFoldersListLazyQuery();

  useEffect(() => {
    getForumFoldersList({
      variables: {
        forum_id: forum_id,
        filter: bouncedFilter,
        first: PAGE_SIZE,
        after: null,
      },
    });
    addPaginationVariableForGetForumFoldersList({
      filter,
      forum_id,
    });
  }, [
    getForumFoldersList,
    forum_id,
    bouncedFilter,
    addPaginationVariableForGetForumFoldersList,
    filter,
  ]);

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (
      !foldersData ||
      foldersData.getForumFoldersList.error !== ErrorType.NoError
    ) {
      return null;
    }

    return foldersData.getForumFoldersList.edges.map((edge) => (
      <FolderItem
        key={edge.node.forum_folder_id}
        forum_id={forum_id}
        id={edge.node.forum_folder_id}
        name={edge.node.name}
        created_by={edge.node.created_by}
        description={edge.node.description || ''}
        totalThreads={47}
        totalPosts={500}
      />
    ));
  }, [error, foldersData, forum_id]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (foldersData?.getForumFoldersList.pageInfo.hasNextPage) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: foldersData.getForumFoldersList.pageInfo.endCursor,
            filter: bouncedFilter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, bouncedFilter, foldersData],
  );

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
            {`${foldersData?.getForumFoldersList.pageInfo.totalEdges || 0} ${tr(
              'Topics',
            )}`}
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

      <Stack gap="16px">
        <Box style={{ textAlign: 'center' }}>
          {loading && <CircularProgress />}
        </Box>
        {cardListComs}
        <IonInfiniteScroll onIonInfinite={handleInfinite}>
          <IonInfiniteScrollContent
            loadingText={`${tr('Loading')}...`}
            loadingSpinner="bubbles"
          />
        </IonInfiniteScroll>
      </Stack>
    </PageLayout>
  );
}
