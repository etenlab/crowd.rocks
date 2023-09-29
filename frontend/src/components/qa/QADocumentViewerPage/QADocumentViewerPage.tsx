import { RouteComponentProps } from 'react-router';
import { IonIcon } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { FilterContainer } from '../../common/styled';

import { useGetDocumentQuery } from '../../../generated/graphql';

import { QADocumentViewer } from '../QADocumentViewer/QADocumentViewer';

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

  if (!documentData?.getDocument.document) {
    return <PageLayout>Loading...</PageLayout>;
  }

  const { file_name } = documentData.getDocument.document;

  return (
    <PageLayout>
      <FilterContainer>
        <Caption>{file_name}</Caption>
        <IonIcon />
      </FilterContainer>
      <QADocumentViewer documentId={document_id} mode="view" />
    </PageLayout>
  );
}
