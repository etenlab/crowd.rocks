import {
  Stack,
  Typography,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { Check } from '../../common/icons/Check';

import { TextyDocument } from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { NavArrowRight } from '../../common/icons/NavArrowRight';

type DocumentBotTranslateModalProps = {
  onClose(): void;
  document: TextyDocument;
};

export function DocumentBotTranslateModal({
  onClose,
  document,
}: DocumentBotTranslateModalProps) {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [
    documentBotTranslate,
    { loading: translating, data: translatingData },
  ] = botTranslateDocument();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const possibleBots: Array<{ name: string; translateFn: () => any }> = [
    {
      name: 'Lilt',
      translateFn: documentBotTranslate,
    },
  ];

  let title = tr('Translate using bot');
  let content = tr('Click the button below to start translation.');
  let bottomCom = (
    <Stack gap="16px">
      <LangSelector
        title={tr('Select target language')}
        selected={targetLang}
        onChange={(_sourceLangTag, sourceLangInfo) => {
          setTargetLanguage(sourceLangInfo);
        }}
        onClearClick={() => setTargetLanguage(null)}
      />
      {possibleBots.map((pbot) => (
        <Button
          key={pbot.name}
          variant="contained"
          color="blue"
          startIcon={<NavArrowRight sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={() => {
            pbot.translateFn();
          }}
        >
          {pbot.name}
        </Button>
      ))}
      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (translating) {
    title = tr('Uploading document');
    content = tr('Started document uploading... ');
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
    translatingData &&
    translatingData?.documentLiltTranslate?.error === ErrorType.NoError
  ) {
    title = tr('Great news!');
    content = tr('The document translated successfully!');
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

  if (
    translatingData &&
    translatingData.documentLiltTranslate.error !== ErrorType.NoError
  ) {
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
