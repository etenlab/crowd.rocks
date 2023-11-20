import {
  Stack,
  Typography,
  Divider,
  Button,
  LinearProgress,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { Check } from '../../common/icons/Check';

import {
  BotType,
  ErrorType,
  TextyDocument,
  useSourceToTargetLanguagesForBotLazyQuery,
} from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useCallback, useMemo, useState } from 'react';
import { LanguageInfo, langInfo2langInput } from '../../../../../utils';
import { NavArrowRight } from '../../common/icons/NavArrowRight';
import { useBotTranslateDocumentMutation } from '../../../hooks/useBotTranslateDocumentMutation';

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
        langauges: { sourceLang },
      },
    },
  } = useAppContext();

  const [
    documentBotTranslate,
    { loading: translating, data: translatingData },
  ] = useBotTranslateDocumentMutation();
  const [selectedBot, setSelectedBot] = useState<BotType>();
  const [targetLang, setTargetLanguage] = useState<LanguageInfo | null>(null);

  const [enabledTags, setEnabledTags] = useState<string[]>();

  const [sourceToTargetLanguagesForBot] =
    useSourceToTargetLanguagesForBotLazyQuery();

  const handleBotTypeChange = useCallback(
    async (event: SelectChangeEvent) => {
      const sttLangsQ = await sourceToTargetLanguagesForBot({
        variables: {
          botType: event.target.value as BotType,
        },
      });
      if (!sttLangsQ.data?.languagesForBotTranslate.sourceToTarget) return;
      setSelectedBot(event.target.value as BotType);

      const targetLangCodes =
        sttLangsQ.data.languagesForBotTranslate.sourceToTarget.find(
          (sttl) => sttl.sourceLangCode === sourceLang?.lang.tag,
        )?.targetLangCodes;

      setEnabledTags(targetLangCodes);
    },
    [sourceLang, sourceToTargetLanguagesForBot],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const possibleBots: Array<{ name: string; translateFn: () => any }> = useMemo(
    () => [
      {
        name: 'Lilt',
        translateFn: () =>
          targetLang &&
          documentBotTranslate({
            variables: {
              botType: BotType.Lilt,
              documentId: document.document_id,
              targetLang: langInfo2langInput(targetLang),
            },
          }),
      },
    ],
    [document.document_id, documentBotTranslate, targetLang],
  );

  let title = tr('Translate using bot');
  let content = tr('Click the button below to start translation.');
  let bottomCom = (
    <Stack gap="16px">
      <InputLabel id="tr-bot-select-label">Select translate bot</InputLabel>
      <Select
        labelId="tr-bot-select-label"
        id="tr-bot-select"
        value={selectedBot || ''}
        onChange={handleBotTypeChange}
      >
        {possibleBots.map((pbot) => (
          <MenuItem key={pbot.name} value={pbot.name}>
            {pbot.name}
          </MenuItem>
        ))}
      </Select>
      {selectedBot && (
        <LangSelector
          title={tr('Select target language')}
          selected={targetLang}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setTargetLanguage(sourceLangInfo);
          }}
          enabledTags={enabledTags}
          onClearClick={() => setTargetLanguage(null)}
        />
      )}
      {selectedBot && targetLang && (
        <Button
          variant="contained"
          color="blue"
          startIcon={<NavArrowRight sx={{ fontSize: 24 }} />}
          fullWidth
          onClick={() => {
            const bot = possibleBots.find((pb) => pb.name === selectedBot);
            bot && bot.translateFn();
          }}
        >
          {tr('Start translation')}
        </Button>
      )}
      <Button variant="contained" color="gray_stroke" onClick={onClose}>
        {tr('Cancel')}
      </Button>
    </Stack>
  );

  if (translating) {
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

  if (
    translatingData &&
    translatingData?.botTranslateDocument.error === ErrorType.NoError
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
    translatingData.botTranslateDocument.error !== ErrorType.NoError
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
