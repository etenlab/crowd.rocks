import { useCallback, useState } from 'react';
import { useIonToast } from '@ionic/react';
import {
  Stack,
  Typography,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';
import { Check } from '../../common/icons/Check';
import { FilledCheckCircle } from '../../common/icons/FilledCheckCircle';

import { FileUpload } from '../../common/FileUploadBtn/FileUpload';
import { useAppContext } from '../../../hooks/useAppContext';

import {
  ErrorType,
  useMapUploadMutation,
  useUploadFileMutation,
} from '../../../generated/graphql';

export function MapUploadModal() {
  const [present] = useIonToast();
  const { tr } = useTr();
  const {
    actions: { setModal },
  } = useAppContext();

  const [sendMapFile, { loading, data }] = useMapUploadMutation();
  const [uploadFile, { loading: uploading }] = useUploadFileMutation();

  const [fileName, setFileName] = useState<string>('');

  const addMap = useCallback(
    async (file: File) => {
      if (!file) return;

      try {
        setFileName(file.name);

        const uploadPreviewResult = await uploadFile({
          variables: {
            file: file,
            file_size: file.size,
            file_type: file.type,
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
    [uploadFile, sendMapFile, present],
  );

  let title = tr('Add new map');
  let content = tr(
    'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing.',
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
      <Button
        variant="contained"
        color="gray_stroke"
        onClick={() => setModal(null)}
      >
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
    title = tr('Done!');
    content = tr('Go to your downloaded maps to start translating them.');
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={() => setModal(null)}
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
