import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack, Typography, Button, Divider } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';
import { Input } from '../../common/forms/Input';

import { useForumCreateMutation } from '../../../hooks/useForumUpsertMutation';
import { useForumUpdateMutation } from '../../../hooks/useForumUpsertMutation';

type ForumModalProps = {
  forumData?: {
    id: string;
    name: string;
    description: string;
  };
  onClose(): void;
};

export function ForumModal({ forumData, onClose }: ForumModalProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [forumName, setForumName] = useState<string>(forumData?.name || '');
  const [forumDescription, setForumDescription] = useState<string>(
    forumData?.description || '',
  );

  const [upsertForum] = useForumCreateMutation();
  const [updateForum] = useForumUpdateMutation();

  const handleSave = useCallback(async () => {
    if (forumName.trim() === '') {
      present({
        message: tr('Forum name cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    if (forumData) {
      updateForum({
        variables: {
          id: forumData.id,
          name: forumName.trim(),
          description:
            forumDescription.trim() !== '' ? forumDescription.trim() : null,
        },
      });
    } else {
      upsertForum({
        variables: {
          name: forumName.trim(),
          description:
            forumDescription.trim() !== '' ? forumDescription.trim() : null,
        },
      });
    }

    onClose();
  }, [
    forumName,
    forumData,
    onClose,
    present,
    tr,
    updateForum,
    upsertForum,
    forumDescription,
  ]);

  const title = !forumData ? tr('Add new forum') : tr('Edit Forum');
  const content = !forumData
    ? tr(
        'To create a new forum, please make sure that no similar forum exists.',
      )
    : tr('To edit a forum, please make sure that no similar forum exists.');
  const buttonTitle = !forumData ? tr('Create New') : tr('Save');

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
          value={forumName}
          onChange={setForumName}
        />
        <Input
          placeholder={tr('Description...')}
          value={forumDescription}
          onChange={setForumDescription}
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
