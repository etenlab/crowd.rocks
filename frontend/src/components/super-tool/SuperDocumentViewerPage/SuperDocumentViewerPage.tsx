import { useState } from 'react';
import { useParams } from 'react-router';
import { useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
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
import { Tag } from '../../common/chips/Tag';
import { MoreHorizButton } from '../../common/buttons/MoreHorizButton';
import { DownloadCircle } from '../../common/icons/DownloadCircle';

import { useGetDocumentQuery } from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';

import { DocumentViewer } from '../../documents/DocumentViewer/DocumentViewer';
import { useAppContext } from '../../../hooks/useAppContext';

export function SuperDocumentViewerPage() {
  const { tr } = useTr();
  const { document_id } = useParams<{ document_id: string }>();
  const {
    states: {
      components: { ionContentScrollElement },
    },
  } = useAppContext();

  const [pageStatus, setPageStatus] = useState<'shown' | 'hidden' | null>(null);

  const { data: documentData } = useGetDocumentQuery({
    variables: {
      document_id,
    },
  });

  useIonViewDidEnter(() => {
    setPageStatus('shown');
  });

  useIonViewDidLeave(() => {
    setPageStatus('hidden');
  });

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

  return (
    <PageLayout>
      <Caption>{tr('Super Tool')}</Caption>

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
        <MoreHorizButton dropDownList={dropDownList} />
      </Stack>

      <Divider />

      <Typography variant="h4" sx={{ fontWeight: 500 }}>
        {document.file_name}
      </Typography>

      <DocumentViewer
        documentId={document_id}
        mode="view"
        range={{}}
        dots={[]}
        onClickWord={() => {}}
        onChangeRange={() => {}}
        customScrollParent={
          pageStatus === 'shown' && ionContentScrollElement
            ? ionContentScrollElement
            : undefined
        }
      />
    </PageLayout>
  );
}
