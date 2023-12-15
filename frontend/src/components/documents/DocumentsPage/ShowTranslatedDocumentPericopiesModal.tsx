import {
  Stack,
  Typography,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { Check } from '../../common/icons/Check';

import {
  TextyDocument,
  useDocumentByPericopiesTranslateMutation,
} from '../../../generated/graphql';

import { langInfo2langInput } from '../../../../../utils';

import { useAppContext } from '../../../hooks/useAppContext';
import { useEffect } from 'react';

type ShowTranslatedDocumentPericopiesModalProps = {
  onClose(): void;
  document: TextyDocument;
};

export function ShowTranslatedDocumentPericopiesModal({
  onClose,
  document,
}: ShowTranslatedDocumentPericopiesModalProps) {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: {
          documentPage: { target: targetLang },
        },
      },
    },
  } = useAppContext();

  const [documentByPericopiesTranslate, { loading, data }] =
    useDocumentByPericopiesTranslateMutation();

  useEffect(() => {
    if (!targetLang) {
      return;
    }
    documentByPericopiesTranslate({
      variables: {
        documentId: document.document_id,
        targetLang: langInfo2langInput(targetLang),
      },
    });
  }, [document.document_id, documentByPericopiesTranslate, targetLang]);

  let title = tr('Document translation by votes');
  let content = tr('Click the link to download file.');
  let bottomCom = (
    <Stack gap="16px">
      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Close')}
      </Button>
    </Stack>
  );

  if (loading) {
    title = tr('Composing document');
    content = tr('Started document composition ... ');
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
        <Typography variant="body1" color="text.gray">
          {document.file_name}
        </Typography>
      </Stack>
    );
  }

  if (
    data &&
    data.documentByPericopiesTranslate.fileUrl &&
    data.documentByPericopiesTranslate.fileContent
  ) {
    title = tr('Great news, translated file composed!');
    content = data.documentByPericopiesTranslate.fileContent;
    bottomCom = (
      <Stack gap="16px">
        <Typography variant="h3">
          {tr('Click the link below to download translation as file.')}
        </Typography>
        <a href={data.documentByPericopiesTranslate.fileUrl}>
          {data.documentByPericopiesTranslate.fileName}
        </a>
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Close')}
        </Button>
      </Stack>
    );
  }

  if (data && !data.documentByPericopiesTranslate.fileUrl) {
    title = tr('Something went wrong');
    content = tr(
      'We apologize for the inconvenience, there seems to be an issue with translating document at the moment. Please, try again later.',
    );
    bottomCom = (
      <Stack gap="16px">
        <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Close')}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Stack>
          <Typography variant="h2">{title}</Typography>
        </Stack>
        <Divider />
        <Typography variant="body1">{content}</Typography>
      </Stack>
      {bottomCom}
    </Stack>
  );
}
