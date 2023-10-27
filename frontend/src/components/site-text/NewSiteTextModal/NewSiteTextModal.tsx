import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import {
  Stack,
  Typography,
  Divider,
  Button,
  Badge,
  LinearProgress,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';
import { Check } from '../../common/icons/Check';
import { FilledCheckCircle } from '../../common/icons/FilledCheckCircle';
import { Cancel } from '../../common/icons/Cancel';

import { Input } from '../../common/forms/Input';

import { useSiteTextUpsertMutation } from '../../../hooks/useSiteTextUpsertMutation';
import { ErrorType } from '../../../generated/graphql';

type NewSiteTextModalProps = {
  onClose(): void;
};

export function NewSiteTextModal({ onClose }: NewSiteTextModalProps) {
  const [present] = useIonToast();
  const { tr } = useTr();

  const [siteTextlikeString, setSiteTextlikeString] = useState<string>('');

  const [siteTextUpsert, { data, loading }] = useSiteTextUpsertMutation();

  const handleUpsert = useCallback(async () => {
    if (siteTextlikeString.trim().length === 0) {
      present({
        message: tr('Site Text cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    siteTextUpsert({
      variables: {
        siteTextlike_string: siteTextlikeString.trim(),
        definitionlike_string: 'Site User Interface Text',
        language_code: 'en',
        dialect_code: null,
        geo_code: null,
      },
    });
  }, [siteTextlikeString, siteTextUpsert, present, tr]);

  let title = tr('Add new site text string');
  let content = '';
  let bottomCom = (
    <Stack gap="16px">
      <Button
        variant="contained"
        color="blue"
        startIcon={<AddCircle sx={{ fontSize: 24 }} />}
        fullWidth
        onClick={handleUpsert}
      >
        {tr('Save')}
      </Button>

      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (loading) {
    title = tr('Creating new site text string...');
    content = '';
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
      </Stack>
    );
  }

  if (data && data.siteTextUpsert.error === ErrorType.NoError) {
    title = tr('Great news!');
    content = tr('Site text string created successfully!');
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to site text strings')}
        </Button>
      </Stack>
    );
  }

  if (data && data.siteTextUpsert.error !== ErrorType.NoError) {
    title = tr('Something went wrong');
    content = tr(
      'We apologize for the inconvenience, there seems to be an issue with creating new site text at the moment. Please, try again later.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to site text strings')}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Stack
          gap="10px"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {data && data.siteTextUpsert.error === ErrorType.NoError ? (
            <FilledCheckCircle color="green" />
          ) : null}
          {data && data.siteTextUpsert.error !== ErrorType.NoError ? (
            <Badge
              sx={(theme) => ({
                padding: '1px',
                borderRadius: '50%',
                backgroundColor: theme.palette.background.red,
              })}
            >
              <Cancel color="white" sx={{ fontSize: '18px' }} />
            </Badge>
          ) : null}
          <Typography variant="h2">{title}</Typography>
        </Stack>
        <Divider />
        <Typography variant="body1" color="text.gray">
          {content}
        </Typography>
        <Input
          placeholder={tr('Input new site text string')}
          value={siteTextlikeString}
          onChange={setSiteTextlikeString}
        />
      </Stack>
      {bottomCom}
    </Stack>
  );
}
