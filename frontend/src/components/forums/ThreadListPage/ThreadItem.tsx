import { Divider, Stack, Typography, Button } from '@mui/material';

import { DeleteCircle } from '../../common/icons/DeleteCircle';
import { Edit } from '../../common/icons/Edit';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { ThreadModal } from '../modals/ThreadModal';
import { DiscussionIconButton } from '../../Discussion/DiscussionButton';
import { TableNameType } from '../../../generated/graphql';

export type ThreadItemProps = {
  folder_id: string;
  id: string;
  name: string;
};

export function ThreadItem({ folder_id, id, name }: ThreadItemProps) {
  const { tr } = useTr();

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const handleEdit = () => {
    openModal(
      <ThreadModal
        folder_id={folder_id}
        threadData={{ id, name }}
        onClose={closeModal}
      />,
    );
  };

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

      <Typography variant="h3">{name}</Typography>
    </Stack>
  );
}
