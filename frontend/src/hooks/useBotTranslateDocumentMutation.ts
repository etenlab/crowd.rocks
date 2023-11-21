import { useIonToast } from '@ionic/react';

import { useBotTranslateDocumentMutation as useGeneratedBotTranslateDocumentMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUploadDocument } from '../cacheUpdators/uploadDocument';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';
import { langInfo2String, subTags2LangInfo } from '../../../utils';

export function useBotTranslateDocumentMutation() {
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

  return useGeneratedBotTranslateDocumentMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.botTranslateDocument.document &&
        data.botTranslateDocument.error === ErrorType.NoError
      ) {
        const newDocument = data.botTranslateDocument.document;

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
          message: tr('Success at translating document!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useBotTranslateDocumentMutation: ', errors);
        console.log(data?.botTranslateDocument.error);

        present({
          message: `${tr('Failed at uploading new Document!')} [${data
            ?.botTranslateDocument.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.botTranslateDocument.error);
      }
    },
  });
}
