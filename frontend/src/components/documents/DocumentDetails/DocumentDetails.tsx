import { RouteComponentProps } from 'react-router';
import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { useGetDocumentQuery } from '../../../generated/graphql';
import { FileContentTextarea } from './FileContentTextArea';

interface DocumentsDetailsPageProps
  extends RouteComponentProps<{
    document_id: string;
  }> {}

export const DocumentDetailsPage: React.FC<DocumentsDetailsPageProps> = ({
  match: {
    params: { document_id },
  },
}: DocumentsDetailsPageProps) => {
  const { data: documentData } = useGetDocumentQuery({
    variables: {
      document_id,
    },
  });
  if (!documentData?.getDocument.document) {
    return <PageLayout>Loading...</PageLayout>;
  }
  const { file_name, file_url } = documentData.getDocument.document;

  return (
    <PageLayout>
      <Caption>{file_name}</Caption>
      <FileContentTextarea src={file_url} />
    </PageLayout>
  );
};
