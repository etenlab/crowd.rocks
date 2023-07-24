import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

export const UPLOAD_FILE_MUTATION = gql`
  mutation MapUpload($file: Upload!) {
    mapUpload(file: $file) {
      original_map_id
      map_file_name
    }
  }
`;

export const GET_ORIGINAL_MAPS_QUERY = gql`
  query GetOrigMapsListOutput {
    getOrigMapsList {
      origMapList {
        original_map_id
        map_file_name
        created_at
        created_by
      }
    }
  }
`;

export function useMapTranslationTools() {
  const apolloClient = useApolloClient();

  const getOriginalMaps = useCallback(async (): Promise<TMapsList> => {
    const res = await apolloClient.query({
      query: GET_ORIGINAL_MAPS_QUERY,
    });

    return res.data.getOrigMapsList.origMapList.map((r) => ({
      id: r.original_map_id,
      name: r.map_file_name,
      createdAt: r.created_at,
      createdByUserId: r.created_by,
    }));
  }, [apolloClient]);

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
          },
        })
        .then((res) => {
          console.log(`Map file (name:${file.name}) is uploaded.`);
          const { original_map_id, map_file_name } = res.data.mapUpload;
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
    getOriginalMaps,
  };
}
