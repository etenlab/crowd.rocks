import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Stack, Typography, Button } from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import { ErrorType, useGetThreadsLazyQuery } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ThreadModal } from '../modals/ThreadModal';
import { ThreadItem } from './ThreadItem';

export function ThreadListPage() {
  const { tr } = useTr();
  const { folder_id, folder_name } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
    folder_id: string;
    folder_name: string;
  }>();

  const [filter, setFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getThreads, { data: threadsData, error }] = useGetThreadsLazyQuery();

  useEffect(() => {
    getThreads({ variables: { folder_id } });
  }, [getThreads, folder_id]);

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!threadsData || threadsData.threads.error !== ErrorType.NoError) {
      return null;
    }
    return threadsData.threads.threads.map((thread) => (
      <ThreadItem
        key={thread.thread_id}
        folder_id={folder_id}
        id={thread.thread_id}
        name={thread.name}
      />
    ));
  }, [error, threadsData, folder_id]);

  const handleOpenModal = () => {
    openModal(<ThreadModal folder_id={folder_id} onClose={closeModal} />);
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
            {`${3} ${tr('Threads')}`}
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
