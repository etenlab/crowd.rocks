import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, Typography, Button, Divider } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';
import { Input } from '../../common/forms/Input';

import { useForumFolderCreateMutation } from '../../../hooks/useFolderUpsertMutation';
import { useForumFolderUpdateMutation } from '../../../hooks/useFolderUpsertMutation';

type FolderModalProps = {
  forum_id: string;
  folderData?: {
    id: string;
    name: string;
    description: string;
  };
  onClose(): void;
};

export function FolderModal({
  onClose,
  forum_id,
  folderData,
}: FolderModalProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [folderName, setFolderName] = useState<string>(folderData?.name || '');
  const [description, setDescription] = useState<string>(
    folderData?.description || '',
  );

  const [upsertFolder] = useForumFolderCreateMutation(forum_id);
  const [updateFolder] = useForumFolderUpdateMutation(forum_id);

  const handleSave = useCallback(async () => {
    if (folderName.trim() === '') {
      present({
        message: tr('Folder name cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    if (folderData) {
      updateFolder({
        variables: {
          forum_id: forum_id,
          id: folderData.id,
          name: folderName.trim(),
        },
      });
    } else {
      upsertFolder({
        variables: {
          forum_id: forum_id,
          name: folderName.trim(),
        },
      });
    }

    onClose();
  }, [
    folderName,
    folderData,
    onClose,
    present,
    tr,
    updateFolder,
    forum_id,
    upsertFolder,
  ]);

  const title = !folderData ? tr('Add new topic') : tr('Edit topic');
  const content = !folderData
    ? tr(
        'To create a new topic, please make sure that no similar topic exists.',
      )
    : tr('To edit a topic, please make sure that no similar topic exists.');
  const buttonTitle = !folderData ? tr('Create New') : tr('Save');

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
          placeholder={tr('Forum Name')}
          value={folderName}
          onChange={setFolderName}
        />
        <Input
          placeholder={tr('Description...')}
          value={description}
          onChange={setDescription}
          multiline
          rows={4}
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
