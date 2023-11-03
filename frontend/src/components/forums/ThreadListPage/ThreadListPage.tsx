import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import {
  Stack,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import {
  ErrorType,
  useGetThreadsListLazyQuery,
} from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ThreadModal } from '../modals/ThreadModal';
import { ThreadItem } from './ThreadItem';

import { PAGE_SIZE } from '../../../const/commonConst';

export function ThreadListPage() {
  const { tr } = useTr();
  const { forum_folder_id, folder_name } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    forum_folder_id: string;
    folder_name: string;
  }>();

  const [filter, setFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    actions: { createModal, addPaginationVariableForGetTheadsList },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getThreadsList, { data: threadsData, error, loading, fetchMore }] =
    useGetThreadsListLazyQuery();

  useEffect(() => {
    getThreadsList({
      variables: {
        filter: bouncedFilter,
        forum_folder_id: forum_folder_id,
        first: PAGE_SIZE,
        after: null,
      },
    });
    addPaginationVariableForGetTheadsList({
      filter: bouncedFilter,
      forum_folder_id,
    });
  }, [
    getThreadsList,
    forum_folder_id,
    bouncedFilter,
    addPaginationVariableForGetTheadsList,
  ]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (threadsData?.getThreadsList.pageInfo.hasNextPage) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: threadsData.getThreadsList.pageInfo.endCursor,
            filter: bouncedFilter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, bouncedFilter, threadsData],
  );

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (
      !threadsData ||
      threadsData.getThreadsList.error !== ErrorType.NoError
    ) {
      return null;
    }
    return threadsData.getThreadsList.edges.map((edge) => (
      <ThreadItem
        key={edge.node.thread_id}
        forum_folder_id={edge.node.forum_folder_id}
        id={edge.node.thread_id}
        name={edge.node.name}
      />
    ));
  }, [error, threadsData]);

  const handleOpenModal = () => {
    openModal(
      <ThreadModal forum_folder_id={forum_folder_id} onClose={closeModal} />,
    );
  };

  return (
    <PageLayout>
      <Caption>{folder_name}</Caption>

      <Stack gap="13px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" color="dark">
            {`${threadsData?.getThreadsList.pageInfo.totalEdges || 0} ${tr(
              'Threads',
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
