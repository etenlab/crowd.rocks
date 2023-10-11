import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonButton } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { CaptionContainer } from '../../common/styled';

import { useGetDocumentQuery } from '../../../generated/graphql';

import { PericopeDocumentViewer } from '../PericopeDocumentViewer/PericopeDocumentViewer';
import { ViewMode } from '../../common/BaseDocumentViewer';

interface PericopeDocumentViewerPageProps
  extends RouteComponentProps<{
    document_id: string;
  }> {}

export function PericopeDocumentViewerPage({
  match: {
    params: { document_id },
  },
}: PericopeDocumentViewerPageProps) {
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
      <CaptionContainer>
        <Caption>{file_name}</Caption>
        <IonButton fill="outline" onClick={handleToggleMode}>
          {mode}
        </IonButton>
      </CaptionContainer>

      <PericopeDocumentViewer documentId={document_id} mode={mode} />
    </PageLayout>
  );
}
