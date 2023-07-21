import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

export const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile($mapFile: Upload!) {
    uploadFile(mapFile: $mapFile) {
      original_map_id
      map_file_name
    }
  }
`;

export function useMapTranslationTools() {
  const apolloClient = useApolloClient();

  const sendMapFile = useCallback(
    async (
      file: File,
      afterSuccess: (uploadedFileData: {
        id: string;
        fileName: string;
      }) => void,
      afterFail: (error: Error) => void,
    ): Promise<void> => {
      apolloClient
        .mutate({
          mutation: UPLOAD_FILE_MUTATION,
          variables: {
            file,
            file_size: file.size,
            file_type: file.type,
          },
        })
        .then((res) => {
          console.log(`Map file (name:${file.name}) is uploaded.`);
          const { original_map_id, map_file_name } = res.data.uploadFile;
          afterSuccess({ id: original_map_id, fileName: map_file_name });
        })
        .catch((error) => {
          console.log(error);
          afterFail(error);
        });
    },
    [apolloClient],
  );

  return {
    sendMapFile,
  };
}
