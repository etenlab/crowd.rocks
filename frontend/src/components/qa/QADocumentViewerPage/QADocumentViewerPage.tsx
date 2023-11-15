import { useState } from 'react';
import { useParams } from 'react-router';
import {
  Stack,
  Box,
  CircularProgress,
  Button,
  Divider,
  Typography,
} from '@mui/material';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';
import { downloadFromUrl } from '../../../common/utility';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { Switch } from '../../common/buttons/Switch';
import { Tag } from '../../common/chips/Tag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { DownloadCircle } from '../../common/icons/DownloadCircle';

import { useGetDocumentQuery } from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';

import { QADocumentViewer } from '../QADocumentViewer/QADocumentViewer';
import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';

export function QADocumentViewerPage() {
  const { tr } = useTr();
  const { document_id } = useParams<{ document_id: string }>();

  const { data: documentData } = useGetDocumentQuery({
    variables: {
      document_id,
    },
  });

  const [mode, setMode] = useState<ViewMode>('view');

  const document = documentData ? documentData.getDocument.document : null;

  const handleDownloadFile = () => {
    if (document) {
      downloadFromUrl(document.file_name, document.file_url);
    }
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
  ].filter((item) => item.component !== null);

  if (!document) {
    return (
      <PageLayout>
        <Caption>{tr('Details')}</Caption>
        <Box style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  const handleToggleMode = () => {
    setMode((mode) => {
      if (mode === 'view') {
        return 'edit';
      } else {
        return 'view';
      }
    });
  };
  return (
    <PageLayout>
      <Caption>{tr('Details')}</Caption>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
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
        <Button
          onClick={handleToggleMode}
          variant="text"
          sx={{ display: 'flex', alignItem: 'center', gap: '6px' }}
        >
          <Typography variant="h5" color="text.gray">
            {tr('Edit mode')}
          </Typography>
          <Switch checked={mode === 'edit'} />
        </Button>
        <MoreHorizButton dropDownList={dropDownList} />
      </Stack>

      <Divider />

      <Typography variant="h4" sx={{ fontWeight: 500 }}>
        {document.file_name}
      </Typography>

      <QADocumentViewer documentId={document_id} mode={mode} />
    </PageLayout>
  );
}
