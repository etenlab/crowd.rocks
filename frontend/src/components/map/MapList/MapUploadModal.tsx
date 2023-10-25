import { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';
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

import { FileUpload } from '../../common/FileUploadBtn/FileUpload';

import {
  ErrorType,
  useMapUploadMutation,
  useUploadFileMutation,
} from '../../../generated/graphql';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';

type MapUploadModalProps = {
  onClose(): void;
};

export function MapUploadModal({ onClose }: MapUploadModalProps) {
  const [present] = useIonToast();
  const history = useHistory();
  const { tr } = useTr();
  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
  }>();

  const [sendMapFile, { loading, data }] = useMapUploadMutation({
    refetchQueries: ['GetAllMapsList'],
  });
  const [uploadFile, { loading: uploading }] = useUploadFileMutation();

  const [fileName, setFileName] = useState<string>('');
  const { makeMapThumbnail } = useMapTranslationTools();

  const addMap = useCallback(
    async (file: File) => {
      if (!file) return;

      try {
        setFileName(file.name);

        const previewFile = (await makeMapThumbnail(await file.text(), {
          toWidth: 165,
          toHeight: 165,
          asFile: `${file.name}-thmb`,
        })) as File;

        const uploadPreviewResult = await uploadFile({
          variables: {
            file: previewFile,
            file_size: previewFile.size,
            file_type: previewFile.type,
          },
        });

        const previewFileId = uploadPreviewResult.data?.uploadFile.file?.id
          ? String(uploadPreviewResult.data?.uploadFile.file.id)
          : undefined;

        if (uploadPreviewResult.data?.uploadFile.error !== ErrorType.NoError) {
          throw new Error(uploadPreviewResult.data?.uploadFile.error);
        }

        const mapUploadResult = await sendMapFile({
          variables: {
            file,
            previewFileId,
            file_size: file.size,
            file_type: file.type,
          },
        });

        if (mapUploadResult.data?.mapUpload.error === ErrorType.Unauthorized) {
          history.push(`/${nation_id}/${language_id}/1/login`);
        }

        if (
          mapUploadResult.errors?.length &&
          mapUploadResult.errors?.length > 0
        ) {
          throw new Error(JSON.stringify(mapUploadResult.errors));
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        present({
          message: `${file.name}: ` + error.message,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
      }
    },
    [
      makeMapThumbnail,
      uploadFile,
      sendMapFile,
      history,
      nation_id,
      language_id,
      present,
    ],
  );

  let title = tr('Add new map');
  let content = tr(
    'Click the button below to add a new map(s) to start translating them.',
  );
  let bottomCom = (
    <Stack gap="16px">
      <FileUpload
        accept=".svg"
        onSelect={addMap}
        component={
          <Button
            variant="contained"
            color="blue"
            startIcon={<AddCircle sx={{ fontSize: 24 }} />}
            fullWidth
          >
            {tr('Upload')}
          </Button>
        }
      />
      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (loading || uploading) {
    title = tr('Uploading map');
    content = tr('Started map uploading and translation to known languages.');
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
        <Typography variant="body1" color="text.gray">
          {fileName}
        </Typography>
      </Stack>
    );
  }

  if (data && data.mapUpload.error === ErrorType.NoError) {
    title = tr('Great news!');
    content = tr(
      'Map(s) loaded successfully! Go to your downloaded maps to start translating them.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Maps')}
        </Button>
      </Stack>
    );
  }

  if (data && data.mapUpload.error !== ErrorType.NoError) {
    title = tr('Something went wrong');
    content = tr(
      'We apologize for the inconvenience, there seems to be an issue with loading maps at the moment. Please, try again later.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Maps')}
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
          {data && data.mapUpload.error === ErrorType.NoError ? (
            <FilledCheckCircle color="green" />
          ) : null}
          {data && data.mapUpload.error !== ErrorType.NoError ? (
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
      </Stack>
      {bottomCom}
    </Stack>
  );
}
