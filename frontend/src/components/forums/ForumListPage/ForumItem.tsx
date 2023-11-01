import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Edit } from '../../common/icons/Edit';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { ForumModal } from '../modals/ForumModal';

export type ForumItemProps = {
  id: string;
  name: string;
  description: string;
  totalTopics: number;
  totalThreads: number;
  totalPosts: number;
};

export function ForumItem({
  id,
  name,
  description,
  totalTopics,
  totalThreads,
  totalPosts,
}: ForumItemProps) {
  const { tr } = useTr();
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const handleGoToForumDetail = useCallback(() => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/forums/${id}/${name}`,
    );
  }, [history, nation_id, language_id, cluster_id, id, name]);

  const handleEdit = () => {
    openModal(
      <ForumModal forumData={{ id, name, description }} onClose={closeModal} />,
    );
  };

  return (
    <Stack
      sx={(theme) => ({
        padding: '16px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.text.gray_stroke}`,
        cursor: 'pointer',
        '&:hover': {
          border: `1px solid ${theme.palette.text.blue}`,
        },
      })}
      onClick={handleGoToForumDetail}
      gap="16px"
    >
      <Stack gap="6px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3">{name}</Typography>
          <MoreHorizButton
            component={
              <>
                <Button
                  variant="text"
                  startIcon={<Edit sx={{ fontSize: '22px' }} />}
                  color="dark"
                  sx={{ padding: 0, justifyContent: 'flex-start' }}
                  onClick={handleEdit}
                >
                  {tr('Edit')}
                </Button>

                <Divider />
                <Button
                  variant="text"
                  startIcon={
                    <DeleteCircle sx={{ fontSize: '22px' }} color="red" />
                  }
                  color="red"
                  onClick={() => {}}
                  sx={{ padding: 0, justifyContent: 'flex-start' }}
                >
                  {tr('Delete')}
                </Button>
              </>
            }
          />
        </Stack>
        <Typography variant="body2" color="text.gray">
          {description}
        </Typography>
      </Stack>
      <Divider />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{`${totalTopics} ${tr('topics')}`}</Typography>
        <Typography variant="h4">{`${totalThreads} ${tr(
          'threads',
        )}`}</Typography>
        <Typography variant="h4">{`${totalPosts} ${tr('posts')}`}</Typography>
      </Stack>
    </Stack>
  );
}
