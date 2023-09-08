import { RouteComponentProps } from 'react-router';
import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';
import { useTr } from '../../hooks/useTr';
import { FilterContainer } from '../common/styled';
import { LangSelector } from '../common/LangSelector/LangSelector';
import { useAppContext } from '../../hooks/useAppContext';
import { DocumentsTools } from './DocumentsTools';
import { useCallback } from 'react';
import {
  useDocumentUploadMutation,
  useUploadFileMutation,
} from '../../generated/graphql';

interface DocumentsPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export const DocumentsPage: React.FC<DocumentsPageProps> = () => {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
    actions: { setSourceLanguage },
  } = useAppContext();

  const [uploadFile] = useUploadFileMutation();
  const [documentUpload] = useDocumentUploadMutation();

  const handleAddDocument = useCallback(
    async (file: File) => {
      if (!sourceLang?.lang) {
        console.log(`no lang!`);
        return;
      }
      const uploadResult = await uploadFile({
        variables: {
          file: file,
          file_size: file.size,
          file_type: file.type,
        },
      });
      if (!uploadResult.data?.uploadFile.file?.id) {
        console.log(`S3 upload error `, uploadResult.data?.uploadFile.error);
        return;
      }

      const res = await documentUpload({
        variables: {
          document: {
            file_id: String(uploadResult.data.uploadFile.file.id),
            language_code: sourceLang.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          },
        },
      });
      console.log(`uploaded: `, res);
    },

    [
      documentUpload,
      sourceLang?.dialect?.tag,
      sourceLang?.lang,
      sourceLang?.region?.tag,
      uploadFile,
    ],
  );

  return (
    <PageLayout>
      <Caption>{tr('Documents')}</Caption>
      <FilterContainer>
        <LangSelector
          title={tr('Select language')}
          langSelectorId="mapsListLangSelector"
          selected={sourceLang ?? undefined}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setSourceLanguage(sourceLangInfo);
          }}
          onClearClick={() => setSourceLanguage(null)}
        />
      </FilterContainer>
      <DocumentsTools
        onAddClick={(file) => {
          console.log(file);
          handleAddDocument(file);
        }}
      />
    </PageLayout>
  );
};
