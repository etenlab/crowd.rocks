import { useEffect, useMemo, useState, useCallback } from 'react';
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

import { useGetForumsListLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ForumModal } from '../modals/ForumModal';
import { ForumItem } from './ForumItem';

// import { PAGE_SIZE } from '../../../const/commonConst';
const PAGE_SIZE = 4;

export function ForumListPage() {
  const { tr } = useTr();

  const [filter, setFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    actions: { createModal, addPaginationVariableForGetForumsList },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getForumsList, { data: forumsData, error, loading, fetchMore }] =
    useGetForumsListLazyQuery();

  useEffect(() => {
    getForumsList({
      variables: {
        filter: bouncedFilter,
        first: PAGE_SIZE,
        after: null,
      },
    });
    addPaginationVariableForGetForumsList({
      filter: bouncedFilter,
    });
  }, [bouncedFilter, getForumsList, addPaginationVariableForGetForumsList]);

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!forumsData || forumsData.getForumsList.error !== ErrorType.NoError) {
      return null;
    }

    return forumsData.getForumsList.edges.map((edge) => (
      <ForumItem
        key={edge.node.forum_id}
        id={edge.node.forum_id}
        name={edge.node.name}
        description={edge.node.description || ''}
        created_by={edge.node.created_by}
        totalTopics={100}
        totalThreads={47}
        totalPosts={500}
      />
    ));
  }, [error, forumsData]);

  const handleOpenModal = () => {
    openModal(<ForumModal onClose={closeModal} />);
  };

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (forumsData?.getForumsList.pageInfo.hasNextPage) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: forumsData.getForumsList.pageInfo.endCursor,
            filter: bouncedFilter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, bouncedFilter, forumsData],
  );

  return (
    <PageLayout>
      <Caption>{tr('Community')}</Caption>

      <Stack gap="13px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" color="dark">
            {`${forumsData?.getForumsList.pageInfo.totalEdges || 0} ${tr(
              'Forums',
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
