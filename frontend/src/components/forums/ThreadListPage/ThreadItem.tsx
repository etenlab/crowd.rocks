import { Stack, Typography, Button } from '@mui/material';

import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Edit } from '../../common/icons/Edit';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';

import { useTr } from '../../../hooks/useTr';
import { useDeleteThreadMutation } from '../../../hooks/useDeleteThreadMutation';
import { useAppContext } from '../../../hooks/useAppContext';

import { ThreadModal } from '../modals/ThreadModal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { TableNameType } from '../../../generated/graphql';

import { globals } from '../../../services/globals';

export type ThreadItemProps = {
  forum_folder_id: string;
  id: string;
  name: string;
  created_by: string;
};

export function ThreadItem({
  forum_folder_id,
  id,
  name,
  created_by,
}: ThreadItemProps) {
  const { tr } = useTr();

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [deleteThread] = useDeleteThreadMutation(forum_folder_id);

  const handleEdit = () => {
    openModal(
      <ThreadModal
        forum_folder_id={forum_folder_id}
        threadData={{ id, name }}
        onClose={closeModal}
      />,
    );
  };

  const handleDelete = () => {
    deleteThread({
      variables: {
        thread_id: id,
      },
    });
  };

  const dropDownList =
    globals.get_user_id() === +created_by
      ? [
          {
            key: 'edit_button',
            component: (
              <Button
                variant="text"
                startIcon={<Edit sx={{ fontSize: '22px' }} />}
                color="dark"
                sx={{ padding: 0, justifyContent: 'flex-start' }}
                onClick={handleEdit}
              >
                {tr('Edit')}
              </Button>
            ),
          },
          {
            key: 'delete_button',
            component: (
              <Button
                variant="text"
                startIcon={
                  <DeleteCircle sx={{ fontSize: '22px' }} color="red" />
                }
                color="red"
                onClick={handleDelete}
                sx={{ padding: 0, justifyContent: 'flex-start' }}
              >
                {tr('Delete')}
              </Button>
            ),
          },
        ]
      : [];

  return (
    <Stack
      sx={(theme) => ({
        padding: '16px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.text.gray_stroke}`,
      })}
      gap="6px"
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DiscussionIconButton
          parent_id={id}
          parent_table={TableNameType.Threads}
        />
        <MoreHorizButton dropDownList={dropDownList} />
      </Stack>

      <Typography variant="h3">{name}</Typography>
    </Stack>
  );
}
