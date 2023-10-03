import { useIonToast } from '@ionic/react';

import { useDocumentUploadMutation as useGeneratedDocumentUploadMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUploadDocument } from '../cacheUpdators/uploadDocument';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

export function useDocumentUploadMutation() {
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
  } = useAppContext();
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedDocumentUploadMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.documentUpload.document &&
        data.documentUpload.error === ErrorType.NoError
      ) {
        const newDocument = data.documentUpload.document;

        updateCacheWithUploadDocument(cache, newDocument, sourceLang);

        present({
          message: tr('Success at uploading new document!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useDocumentUploadMutation: ', errors);
        console.log(data?.documentUpload.error);

        present({
          message: `${tr('Failed at uploading new Document!')} [${data
            ?.documentUpload.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
