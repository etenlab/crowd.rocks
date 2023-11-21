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
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { FileUpload } from '../../common/FileUploadBtn/FileUpload';

import { ErrorType } from '../../../generated/graphql';

import { useDocumentUploadMutation } from '../../../hooks/useDocumentUploadMutation';
import { useUploadFileMutation } from '../../../hooks/useUploadFileMutation';
import { useAppContext } from '../../../hooks/useAppContext';

type DocumentUploadModalProps = {
  onClose(): void;
};

export function DocumentUploadModal({ onClose }: DocumentUploadModalProps) {
  const [present] = useIonToast();
  const history = useHistory();
  const { tr } = useTr();
  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
  }>();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
    actions: { setSourceLanguage },
  } = useAppContext();

  const [uploadFile, { loading: uploading }] = useUploadFileMutation();
  const [documentUpload, { loading, data }] = useDocumentUploadMutation();

  const [fileName, setFileName] = useState<string>('');

  const handleAddDocument = useCallback(
    async (file: File | undefined) => {
      if (!sourceLang) {
        present({
          message: tr('Please select document language first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      if (!file) {
        present({
          message: tr('Please choose file first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      setFileName(file.name);

      const uploadResult = await uploadFile({
        variables: {
          file: file,
          file_size: file.size,
          file_type: file.type,
          returnErrorIfExists: true,
        },
      });

      if (uploadResult.data?.uploadFile.error === ErrorType.FileAlreadyExists) {
        present({
          message: tr('File with this name already exists'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      if (
        uploadResult.data?.uploadFile.error !== ErrorType.NoError ||
        uploadResult.data?.uploadFile.file?.id === undefined
      ) {
        return;
      }

      const documentUploadResult = await documentUpload({
        variables: {
          document: {
            file_id: String(uploadResult.data.uploadFile.file.id),
            language_code: sourceLang.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          },
        },
      });

      if (
        documentUploadResult.data?.documentUpload.error ===
        ErrorType.Unauthorized
      ) {
        history.push(`/${nation_id}/${language_id}/1/login`);
      }
    },
    [
      sourceLang,
      uploadFile,
      documentUpload,
      present,
      tr,
      history,
      nation_id,
      language_id,
    ],
  );

  let title = tr('Add new document');
  let content = tr(
    'Click the button below to add a new document to use a Pericope tool.',
  );
  let bottomCom = (
    <Stack gap="16px">
      <LangSelector
        title={tr('Select document language')}
        selected={sourceLang}
        onChange={(_sourceLangTag, sourceLangInfo) => {
          setSourceLanguage(sourceLangInfo);
        }}
        onClearClick={() => setSourceLanguage(null)}
      />

      <FileUpload
        accept=".txt"
        onSelect={handleAddDocument}
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
    title = tr('Uploading document');
    content = tr('Started document uploading... ');
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
        <Typography variant="body1" color="text.gray">
          {fileName}
        </Typography>
      </Stack>
    );
  }

  if (data && data.documentUpload.error === ErrorType.NoError) {
    title = tr('Great news!');
    content = tr(
      'The document loaded successfully! Go to your uploaded documents to use pericope tool.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Documents')}
        </Button>
      </Stack>
    );
  }

  if (data && data.documentUpload.error !== ErrorType.NoError) {
    title = tr('Something went wrong');
    content = tr(
      'We apologize for the inconvenience, there seems to be an issue with loading document at the moment. Please, try again later.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Documents')}
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
          {data && data.documentUpload.error === ErrorType.NoError ? (
            <FilledCheckCircle color="green" />
          ) : null}
          {data && data.documentUpload.error !== ErrorType.NoError ? (
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
