import { useIonToast } from '@ionic/react';

import { useDocumentUploadMutation as useGeneratedDocumentUploadMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUploadDocument } from '../cacheUpdators/uploadDocument';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';
import { langInfo2String, subTags2LangInfo } from '../../../utils';

export function useDocumentUploadMutation() {
  const {
    states: {
      nonPersistent: {
        paginationVariables: { getAllDocuments },
      },
    },
  } = useAppContext();
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedDocumentUploadMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.documentUpload.document &&
        data.documentUpload.error === ErrorType.NoError
      ) {
        const newDocument = data.documentUpload.document;

        const variablesList = Object.values(getAllDocuments).filter((item) => {
          if (
            langInfo2String(
              subTags2LangInfo({
                lang: item.input.language_code,
                dialect: item.input.dialect_code || undefined,
                region: item.input.geo_code || undefined,
              }),
            ) ===
            langInfo2String(
              subTags2LangInfo({
                lang: newDocument.language_code,
                dialect: newDocument.dialect_code || undefined,
                region: newDocument.geo_code || undefined,
              }),
            )
          ) {
            return true;
          } else {
            return false;
          }
        });

        updateCacheWithUploadDocument(cache, newDocument, variablesList);

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
        redirectOnUnauth(data?.documentUpload.error);
      }
    },
  });
}
