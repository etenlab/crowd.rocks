import { useIonToast } from '@ionic/react';
import { useUploadFileMutation as useGeneratedUploadFileMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUploadFileMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();
  return useGeneratedUploadFileMutation({
    update(cache, { data, errors }) {
      if (
        errors ||
        !data ||
        !data.uploadFile.file ||
        !(data.uploadFile.error === ErrorType.NoError)
      ) {
        console.log('useUploadFileMutation: ', errors);
        console.log(data?.uploadFile.error);

        present({
          message: `${tr('Failed at uploading File!')} [${data?.uploadFile
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.uploadFile.error);
      }
    },
  });
}
