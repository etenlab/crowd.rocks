import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
} from '../../../generated/graphql';

export const UPLOAD_FILE_MUTATION = gql`
  mutation MapUpload($file: Upload!) {
    mapUpload(file: $file) {
      original_map_id
      map_file_name
    }
  }
`;

export const GET_ORIGINAL_MAPS_QUERY = gql`
  query GetOrigMapsList($search: String) {
    getOrigMapsList(input: { search: $search }) {
      origMapList {
        original_map_id
        map_file_name
        created_at
        created_by
      }
    }
  }
`;

export const GET_ORIGINAL_MAP_CONTENT_QUERY = gql`
  query GetOrigMapsContent($id: ID!) {
    getOrigMapContent(input: { original_map_id: $id }) {
      original_map_id
      map_file_name
      created_at
      created_by
      content
    }
  }
`;

export function useMapTranslationTools() {
  const apolloClient = useApolloClient();

  const getOrigMapContent = useCallback(
    async (id: string): Promise<TMapWithContent> => {
      const res = await apolloClient.query<{
        getOrigMapContent: GetOrigMapContentOutput;
      }>({
        query: GET_ORIGINAL_MAP_CONTENT_QUERY,
        variables: { id },
      });

      const {
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        content,
      } = res.data.getOrigMapContent;

      return {
        id: original_map_id,
        name: map_file_name,
        createdAt: created_at,
        createdByUserId: created_by,
        content: content,
      };
    },
    [apolloClient],
  );

  const getOriginalMaps = useCallback(
    async (search: string): Promise<TMapsList> => {
      const res = await apolloClient.query<{
        getOrigMapsList: GetOrigMapsListOutput;
      }>({
        query: GET_ORIGINAL_MAPS_QUERY,
        variables: { search },
      });

      return res.data.getOrigMapsList.origMapList.map((r) => ({
        id: r.original_map_id,
        name: r.map_file_name,
        createdAt: r.created_at,
        createdByUserId: r.created_by,
      }));
    },
    [apolloClient],
  );

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
          refetchQueries: [{ query: GET_ORIGINAL_MAPS_QUERY }],
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
    getOrigMapContent,
  };
}
