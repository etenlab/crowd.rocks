import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Edit } from '../../common/icons/Edit';
import { Folder } from '../../common/icons/Folder';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useDeleteForumFolderMutation } from '../../../hooks/useDeleteForumFolderMutation';

import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { FolderModal } from '../modals/FolderModal';

import { globals } from '../../../services/globals';

export type FolderItemProps = {
  forum_id: string;
  id: string;
  name: string;
  description: string;
  created_by: string;
  totalThreads: number;
  totalPosts: number;
};

export function FolderItem({
  forum_id,
  id,
  name,
  description,
  created_by,
  totalThreads,
  totalPosts,
}: FolderItemProps) {
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

  const [deleteForumFolder] = useDeleteForumFolderMutation(forum_id);

  const handleGoToFolderDetail = useCallback(() => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/folders/${id}/${name}`,
    );
  }, [history, nation_id, language_id, cluster_id, id, name]);

  const handleEdit = () => {
    openModal(
      <FolderModal
        forum_id={forum_id}
        folderData={{ id, name, description }}
        onClose={closeModal}
      />,
    );
  };

  const handleDelete = () => {
    deleteForumFolder({
      variables: {
        forum_folder_id: id,
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
        cursor: 'pointer',
        '&:hover': {
          border: `1px solid ${theme.palette.text.blue}`,
        },
      })}
      onClick={handleGoToFolderDetail}
      gap="16px"
    >
      <Stack gap="10px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Folder sx={{ fontSize: 24 }} color="blue" />
          <MoreHorizButton dropDownList={dropDownList} />
        </Stack>
        <Stack gap="6px">
          <Typography variant="h3">{name}</Typography>
          <Typography variant="body2" color="text.gray">
            {description}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ flex: 1 }}>{`${totalThreads} ${tr(
          'threads',
        )}`}</Typography>
        <Typography variant="h4" sx={{ flex: 1 }}>{`${totalPosts} ${tr(
          'posts',
        )}`}</Typography>
      </Stack>
    </Stack>
  );
}
