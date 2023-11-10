import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonButton } from '@ionic/react';
import { Stack } from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { useGetDocumentQuery } from '../../../generated/graphql';

import { QADocumentViewer } from '../QADocumentViewer/QADocumentViewer';
import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';

interface QADocumentViewerPageProps
  extends RouteComponentProps<{
    document_id: string;
  }> {}

export function QADocumentViewerPage({
  match: {
    params: { document_id },
  },
}: QADocumentViewerPageProps) {
  const { data: documentData } = useGetDocumentQuery({
    variables: {
      document_id,
    },
  });
  const [mode, setMode] = useState<ViewMode>('view');

  if (!documentData?.getDocument.document) {
    return <PageLayout>Loading...</PageLayout>;
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

  const { file_name } = documentData.getDocument.document;

  return (
    <PageLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Caption>{file_name}</Caption>
        <IonButton fill="outline" onClick={handleToggleMode}>
          {mode}
        </IonButton>
      </Stack>

      <QADocumentViewer documentId={document_id} mode={mode} />
    </PageLayout>
  );
}
