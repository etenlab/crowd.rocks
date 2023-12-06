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

import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useCallback, useEffect, useState } from 'react';
import { LanguageInfo, langInfo2langInput } from '../../../../../utils';
import { NavArrowRight } from '../../common/icons/NavArrowRight';
import { useIonToast } from '@ionic/react';

type DocumentPericopiesTranslateModalProps = {
  onClose(): void;
  document: TextyDocument;
};

export function DocumentPericopiesTranslateModal({
  onClose,
  document,
}: DocumentPericopiesTranslateModalProps) {
  const { tr } = useTr();
  const [present] = useIonToast();

  const [enabledTags, setEnabledTags] = useState<string[]>();

  const [documentByPericopiesTranslate, { loading, data }] =
    useDocumentByPericopiesTranslateMutation();

  const [targetLang, setTargetLanguage] = useState<LanguageInfo | null>(null);

  useEffect(() => {
    setEnabledTags(['uk']); //todo
  }, []);

  const translateFn = useCallback(() => {
    if (!targetLang) {
      present({
        message: `${tr('Please choose language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }
    documentByPericopiesTranslate({
      variables: {
        documentId: document.document_id,
        targetLang: langInfo2langInput(targetLang),
      },
    });
  }, [
    document.document_id,
    documentByPericopiesTranslate,
    present,
    targetLang,
    tr,
  ]);

  let title = tr('Translate using pericopies translations');
  let content = tr('Click the button below to download translation.');
  let bottomCom = (
    <Stack gap="16px">
      {
        <LangSelector
          title={tr('Select target language')}
          selected={targetLang}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setTargetLanguage(sourceLangInfo);
          }}
          enabledTags={enabledTags}
          onClearClick={() => setTargetLanguage(null)}
        />
      }
      {targetLang && (
        <Button
          variant="contained"
          color="blue"
          startIcon={<NavArrowRight sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={() => {
            translateFn();
          }}
        >
          {tr('Download translation')}
        </Button>
      )}
      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (loading) {
    title = tr('Translating document');
    content = tr('Started document translating ... ');
    bottomCom = (
      <Stack gap="16px">
        <LinearProgress color="orange" />
        <Typography variant="body1" color="text.gray">
          {document.file_name}
        </Typography>
      </Stack>
    );
  }

  if (data && data.documentByPericopiesTranslate.fileUrl) {
    title = tr('Great news!');
    content = tr('The document translated successfully!');
    bottomCom = (
      <Stack gap="16px">
        <a href={data.documentByPericopiesTranslate.fileUrl}>file</a>
        {/* <Button
          variant="contained"
          color="blue"
          onClick={onClose}
          startIcon={<Check sx={{ fontSize: 24 }} />}
        >
          {tr('Go to Documents')}
        </Button> */}
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
          {tr('Go to Documents')}
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
        <Typography variant="body1" color="text.gray">
          {content}
        </Typography>
      </Stack>
      {bottomCom}
    </Stack>
  );
}
