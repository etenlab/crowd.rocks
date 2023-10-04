import { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import {
  FilterContainer,
  CaptionContainer,
  ListCaption,
} from '../../common/styled';
import { RowStack } from '../../common/Layout/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useUploadFileMutation } from '../../../generated/graphql';
import { useDocumentUploadMutation } from '../../../hooks/useDocumentUploadMutation';

import { DocumentList } from '../DocumentList/DocumentList';
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
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const [uploadFile] = useUploadFileMutation();
  const [documentUpload] = useDocumentUploadMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [toast] = useIonToast();
  const [loader, dismissLoader] = useIonLoading();
  const history = useHistory();

  const handleAddDocument = useCallback(
    async (file: File | undefined) => {
      if (!sourceLang?.lang) {
        toast({
          message: tr('Please select language first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      if (!file) {
        toast({
          message: tr('Please choose file first.'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      loader({
        message: `${tr('Uploading')} ${file.name}...`,
      });

      const uploadResult = await uploadFile({
        variables: {
          file: file,
          file_size: file.size,
          file_type: file.type,
        },
      });

      if (!uploadResult.data?.uploadFile.file?.id) {
        toast({
          message: tr('Failed at file upload'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        dismissLoader();
        console.log(`S3 upload error `, uploadResult.data?.uploadFile.error);
        return;
      }

      await documentUpload({
        variables: {
          document: {
            file_id: String(uploadResult.data.uploadFile.file.id),
            language_code: sourceLang.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          },
        },
      });

      dismissLoader();

      setIsOpenModal(false);
    },
    [
      sourceLang?.lang,
      sourceLang?.dialect?.tag,
      sourceLang?.region?.tag,
      loader,
      tr,
      uploadFile,
      dismissLoader,
      documentUpload,
      toast,
    ],
  );

  const handleGoToDocumentViewer = useCallback(
    (documentId: string) => {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/documents/${documentId}`,
      );
    },
    [cluster_id, history, language_id, nation_id],
  );

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Documents')}</Caption>
      </CaptionContainer>

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

      <RowStack>
        <ListCaption>{tr('Document List')}</ListCaption>
        <DocumentsTools onAddClick={() => setIsOpenModal(true)} />
      </RowStack>

      <DocumentList onClickItem={handleGoToDocumentViewer} />

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
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
}
