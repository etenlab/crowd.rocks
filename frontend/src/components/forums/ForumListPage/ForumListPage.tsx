import { useEffect, useMemo, useState } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import { useGetForumsLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ForumModal } from '../modals/ForumModal';
import { ForumItem } from './ForumItem';

export function ForumListPage() {
  const { tr } = useTr();

  const [filter, setFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bouncedFilter] = useDebounce(filter, 500);

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [getForums, { data: forumsData, error }] = useGetForumsLazyQuery();

  useEffect(() => {
    getForums();
  }, [getForums]);

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (!forumsData || forumsData.forums.error !== ErrorType.NoError) {
      return null;
    }

    return forumsData.forums.forums.map((forum) => (
      <ForumItem
        key={forum.forum_id}
        id={forum.forum_id}
        name={forum.name}
        description="Lorem ipsum is placeholder text used in the graphic, print, and publishing."
        totalTopics={100}
        totalThreads={47}
        totalPosts={500}
      />
    ));
  }, [error, forumsData]);

  const handleOpenModal = () => {
    openModal(<ForumModal onClose={closeModal} />);
  };

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
            {`${3} ${tr('Forums')}`}
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
