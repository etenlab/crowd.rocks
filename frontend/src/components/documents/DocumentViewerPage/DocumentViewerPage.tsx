import { RouteComponentProps } from 'react-router';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { useGetDocumentQuery } from '../../../generated/graphql';

import { DocumentViewer } from '../DocumentViewer/DocumentViewer';

interface DocumentViewerPageProps
  extends RouteComponentProps<{
    document_id: string;
  }> {}

export function DocumentViewerPage({
  match: {
    params: { document_id },
  },
}: DocumentViewerPageProps) {
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
      <Caption>{file_name}</Caption>

      <DocumentViewer
        documentId={document_id}
        mode="view"
        range={{}}
        dots={[]}
        onClickWord={() => {}}
        onChangeRange={() => {}}
      />
    </PageLayout>
  );
}
