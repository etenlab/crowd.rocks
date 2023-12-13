import { useCallback, useMemo, useState } from 'react';

import { Stack, Typography, Button, Divider } from '@mui/material';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';
import { downloadFromUrl } from '../../../common/utility';

import { Caption } from '../../common/Caption/Caption';
import { Tag } from '../../common/chips/Tag';
import { Tabs } from '../../common/buttons/Tabs';
import { DownloadCircle } from '../../common/icons/DownloadCircle';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { Select, OptionItem } from '../../common/forms/Select';
import { SearchInput } from '../../common/forms/SearchInput';
import { Search } from '../../common/icons/Search';

import { TextyDocument } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { IonIcon } from '@ionic/react';
import { languageOutline } from 'ionicons/icons';
import { DocumentPericopiesTranslateModal } from '../../documents/DocumentsPage/DocumentPericopiesTranslateModal';

export enum TabKind {
  Document = 'document',
  Translation = 'translation',
}

export enum SuperToolKind {
  Pericope = 'pericope',
  Tagging = 'tagging',
  QA = 'qa',
}

export enum FilterKind {
  All = 'all',
  NotTranslated = 'not translated',
  Translated = 'translated ',
}

export type ToolBoxProps = {
  tab: TabKind;
  onChangeTab(tab: TabKind): void;
  tool: OptionItem;
  onChangeTool(tool: OptionItem): void;
  filter: OptionItem;
  onChangeFilter(filter: OptionItem): void;
  stringFilter: string;
  onChangeStringFilter(str: string): void;
  document: TextyDocument;
};

export function ToolBox({
  tab,
  onChangeTab,
  tool,
  onChangeTool,
  filter,
  onChangeFilter,
  stringFilter,
  onChangeStringFilter,
  document,
}: ToolBoxProps) {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: {
          documentPage: { target },
        },
      },
    },
    actions: { createModal },
  } = useAppContext();
  const [showStringSearch, setShowStringSearch] = useState(false);

  const { openModal, closeModal } = createModal();

  const tabs = useMemo(
    () => [
      {
        label: tr('Document'),
        value: TabKind.Document,
      },
      {
        label: tr('Translation'),
        value: TabKind.Translation,
      },
    ],
    [tr],
  );

  const toolOptions = useMemo(
    () => [
      {
        label: tr('Pericope'),
        value: SuperToolKind.Pericope,
      },
      {
        label: tr('Tagging'),
        value: SuperToolKind.Tagging,
      },
      {
        label: tr('Q&A'),
        value: SuperToolKind.QA,
      },
    ],
    [tr],
  );

  const filterOptions = useMemo(
    () => [
      {
        label: tr('All'),
        value: FilterKind.All,
      },
      {
        label: tr('Translated'),
        value: FilterKind.Translated,
      },
      {
        label: tr('Not Translated'),
        value: FilterKind.NotTranslated,
      },
    ],
    [tr],
  );

  const handleChangeTool = useCallback(
    (value: OptionItem | null) => {
      if (value) {
        onChangeTool(value);
      }
    },
    [onChangeTool],
  );

  const handleStringFilterChange = (value: string) => {
    onChangeStringFilter(value);
  };

  const handleChangeFilter = useCallback(
    (value: OptionItem | null) => {
      if (value) {
        onChangeFilter(value);
      }
    },
    [onChangeFilter],
  );

  const handleDownloadFile = () => {
    downloadFromUrl(document.file_name, document.file_url);
  };

  const handlePericopiesTranslate = () => {
    openModal(
      <DocumentPericopiesTranslateModal
        onClose={closeModal}
        document={document}
      />,
    );
  };

  const handleToggleSearchInput = () => {
    setShowStringSearch((_value) => !_value);
  };

  const dropDownList = [
    {
      key: 'download_button',
      component: (
        <Button
          variant="text"
          startIcon={<DownloadCircle sx={{ fontSize: '24px' }} />}
          color="dark"
          sx={{ padding: 0, justifyContent: 'flex-start' }}
          onClick={handleDownloadFile}
        >
          {tr('Download')}
        </Button>
      ),
    },
    {
      key: 'pericopiesTranslateButton',
      component: (
        <Button
          variant="text"
          startIcon={<IonIcon icon={languageOutline}></IonIcon>}
          color="dark"
          sx={{ padding: 0, justifyContent: 'flex-start' }}
          onClick={handlePericopiesTranslate}
        >
          {tr('Translate using pericopies')}
        </Button>
      ),
    },
  ].filter((item) => item.component !== null);

  const filterCom =
    tab === TabKind.Translation ? (
      <Stack
        direction="row"
        gap="12px"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Stack sx={{ flex: 1 }}>
          <Select
            label={tr('Select sort filter')}
            placeholder={tr('Select sort filter')}
            options={filterOptions}
            value={filter}
            onChange={handleChangeFilter}
          />
        </Stack>
        <Button
          variant="contained"
          onClick={handleToggleSearchInput}
          color="gray_bg"
          sx={{
            padding: '10px',
            minWidth: '0',
            border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
          }}
        >
          <Search sx={{ fontSize: 20 }} />
        </Button>
      </Stack>
    ) : null;

  const stringFilterCom =
    showStringSearch && tab === TabKind.Translation ? (
      <SearchInput
        value={stringFilter}
        onChange={handleStringFilterChange}
        onClickSearchButton={() => {}}
        placeholder={tr('Search by...')}
      />
    ) : null;

  const toolCom =
    tab === TabKind.Document ? (
      <Select
        label={tr('Select the tool')}
        placeholder={tr('Select the tool')}
        options={toolOptions}
        value={tool}
        onChange={handleChangeTool}
      />
    ) : null;

  return (
    <Stack gap="20px">
      <Caption>{tr('Super Tool')}</Caption>

      <Stack gap="16px">
        <Tabs
          tabs={tabs}
          selected={tab}
          onChange={(value) => onChangeTab(value)}
        />

        <Stack gap="10px">
          <Stack
            gap="20px"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              {document.file_name}
            </Typography>

            <MoreHorizButton dropDownList={dropDownList} />
          </Stack>
          <Stack
            gap="14px"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: (theme) =>
                `1px solid ${theme.palette.background.gray_stroke}`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ flex: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
                color="text.gray"
              >
                {tr('Source')}:
              </Typography>
              <Tag
                label={langInfo2String(
                  subTags2LangInfo({
                    lang: document.language_code,
                    dialect: document.dialect_code || undefined,
                    region: document.geo_code || undefined,
                  }),
                )}
                color="blue"
              />
            </Stack>
            <Divider orientation="vertical" />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ flex: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
                color="text.gray"
              >
                {tr('Target')}:
              </Typography>
              <Tag
                label={langInfo2String(target || undefined)}
                color="orange"
              />
            </Stack>
          </Stack>
        </Stack>

        {filterCom}
        {toolCom}
        {stringFilterCom}
      </Stack>
    </Stack>
  );
}
