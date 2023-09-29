import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { useTr } from '../../../hooks/useTr';
import { FilterContainer } from '../../common/styled';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { useAppContext } from '../../../hooks/useAppContext';
import { useCallback, useState } from 'react';
import {
  useDocumentUploadMutation,
  useUploadFileMutation,
} from '../../../generated/graphql';
import { DocumentList } from '../DocumentList/DocumentList';
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

export function DocumentsPage() {
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

      <div style={{ display: 'none' }}>
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
        <DocumentList />

        <IonModal
          isOpen={isOpenModal}
          onDidDismiss={() => setIsOpenModal(false)}
        >
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
      </div>
    </PageLayout>
  );
}
