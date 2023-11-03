import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, Typography, Button, Divider } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';
import { Input } from '../../common/forms/Input';

import { useThreadCreateMutation } from '../../../hooks/useThreadUpsertMutation';
import { useThreadUpdateMutation } from '../../../hooks/useThreadUpsertMutation';

type ThreadModalProps = {
  forum_folder_id: string;
  threadData?: {
    id: string;
    name: string;
  };
  onClose(): void;
};

export function ThreadModal({
  onClose,
  forum_folder_id,
  threadData,
}: ThreadModalProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [threadName, setThreadName] = useState<string>(threadData?.name || '');

  const [upsertThread] = useThreadCreateMutation();
  const [updateThread] = useThreadUpdateMutation();

  const handleSave = useCallback(async () => {
    if (threadName.trim() === '') {
      present({
        message: tr('Thread name cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    if (threadData) {
      updateThread({
        variables: {
          forum_folder_id: forum_folder_id,
          thread_id: threadData.id,
          name: threadName.trim(),
        },
      });
    } else {
      upsertThread({
        variables: {
          forum_folder_id: forum_folder_id,
          name: threadName.trim(),
        },
      });
    }

    onClose();
  }, [
    threadName,
    threadData,
    onClose,
    present,
    tr,
    updateThread,
    forum_folder_id,
    upsertThread,
  ]);

  const title = !threadData ? tr('Add new thread') : tr('Edit thread');
  const content = !threadData
    ? tr(
        'To create a new thread, please make sure that no similar thread exists.',
      )
    : tr('To edit a thread, please make sure that no similar thread exists.');
  const buttonTitle = !threadData ? tr('Create New') : tr('Save');

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Typography variant="h2">{title}</Typography>
        <Divider />
        <Typography variant="body1" color="text.gray">
          {content}
        </Typography>
      </Stack>

      <Stack gap="16px">
        <Input
          placeholder={tr('Thread Name')}
          value={threadName}
          onChange={setThreadName}
        />
      </Stack>

      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          startIcon={<AddCircle sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={handleSave}
        >
          {buttonTitle}
        </Button>

        <Button variant="contained" color="gray_stroke" onClick={onClose}>
          {tr('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
}
