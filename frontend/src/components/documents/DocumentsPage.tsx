import { RouteComponentProps } from 'react-router';
import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';
import { useTr } from '../../hooks/useTr';
import { FilterContainer } from '../common/styled';
import { LangSelector } from '../common/LangSelector/LangSelector';
import { useAppContext } from '../../hooks/useAppContext';
import { useCallback, useState } from 'react';
import {
  GetAllDocumentsDocument,
  useDocumentUploadMutation,
  useGetAllDocumentsQuery,
  useUploadFileMutation,
} from '../../generated/graphql';
import { DocumentsList } from './DocumentsList';
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { NewDocumentForm } from './NewDocumentForm';
import { DocumentsTools } from './DocumentsTools';

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
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [present] = useIonToast();

  const { data: allDocuments } = useGetAllDocumentsQuery({
    variables: {
      languageInput: sourceLang
        ? {
            language_code: sourceLang?.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          }
        : undefined,
    },
  });

  const handleAddDocument = useCallback(
    async (file: File | undefined) => {
      if (!sourceLang?.lang) {
        present({
          message: tr('Please select language first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      if (!file) {
        present({
          message: tr('Please choose file first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      const uploadResult = await uploadFile({
        variables: {
          file: file,
          file_size: file.size,
          file_type: file.type,
        },
        refetchQueries: [GetAllDocumentsDocument],
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
      setIsOpenModal(false);
    },
    [
      documentUpload,
      present,
      sourceLang?.dialect?.tag,
      sourceLang?.lang,
      sourceLang?.region?.tag,
      tr,
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
      <DocumentsTools onAddClick={() => setIsOpenModal(true)} />
      <DocumentsList allDocuments={allDocuments?.getAllDocuments.documents} />
      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('New Document')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <NewDocumentForm
            onSave={handleAddDocument}
            onCancel={() => {
              setIsOpenModal(false);
            }}
          />
        </IonContent>
      </IonModal>
    </PageLayout>
  );
};
