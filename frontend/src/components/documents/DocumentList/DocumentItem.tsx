import { Stack, Typography, Button, Divider } from '@mui/material';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';
import { downloadFromUrl } from '../../../common/utility';

import { GoogleDocs } from '../../common/icons/GoogleDocs';
import { DownloadCircle } from '../../common/icons/DownloadCircle';

import { Tag } from '../../common/chips/Tag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';

import { TextyDocument } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { languageOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useAppContext } from '../../../hooks/useAppContext';
import { DocumentBotTranslateModal } from '../../documents/DocumentsPage/DocumentBotTranslateModal';

type DocumentItemProps = {
  document: TextyDocument;
  onClickItem(documentId: string): void;
};

export function DocumentItem({ document, onClickItem }: DocumentItemProps) {
  const {
    actions: { createModal },
  } = useAppContext();
  const { tr } = useTr();
  const { openModal, closeModal } = createModal();
  const langInfo = subTags2LangInfo({
    lang: document.language_code,
    dialect: document.dialect_code || undefined,
    region: document.geo_code || undefined,
  });

  const handleClick = () => {
    onClickItem(document.document_id);
  };

  const handleDownloadFile = () => {
    downloadFromUrl(document.file_name, document.file_url);
  };

  const handleBotTranslate = () => {
    openModal(
      <DocumentBotTranslateModal onClose={closeModal} document={document} />,
    );
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
      key: 'bottranslate_button',
      component: (
        <Button
          variant="text"
          startIcon={<IonIcon icon={languageOutline}></IonIcon>}
          color="dark"
          sx={{ padding: 0, justifyContent: 'flex-start' }}
          onClick={handleBotTranslate}
        >
          {tr('Translate using bot')}
        </Button>
      ),
    },
  ].filter((item) => item.component !== null);

  return (
    <Stack
      onClick={handleClick}
      direction="row"
      alignItems="center"
      gap="20px"
      sx={(theme) => ({
        padding: '10px 14px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.background.gray_stroke}`,
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.palette.background.blue,
        },
      })}
    >
      <Stack
        gap="9px"
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ flex: 1 }}
      >
        <GoogleDocs sx={{ fontSize: 22 }} color="gray" />
        <Divider
          variant="middle"
          orientation="vertical"
          sx={{ height: '18px' }}
        />
        <Typography variant="body2" sx={{ lineHeight: '22px' }}>
          {document.file_name}
        </Typography>
      </Stack>

      <Tag label={langInfo2String(langInfo)} color="blue" />

      <MoreHorizButton dropDownList={dropDownList} />
    </Stack>
  );
}
