import { useEffect, useMemo, useCallback } from 'react';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { Stack, Box, CircularProgress } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useGetAllDocumentsLazyQuery } from '../../../generated/graphql';

import { DocumentItem } from './DocumentItem';

import { PAGE_SIZE } from '../../../const/commonConst';

type DocumentListProps = {
  filter: string;
  language: LanguageInfo;
  onClickItem(documentId: string): void;
};

export function DocumentList({
  filter,
  language,
  onClickItem,
}: DocumentListProps) {
  const { tr } = useTr();

  const {
    actions: { addPaginationVariableForGetAllDocuments },
  } = useAppContext();

  const [getAllDocuments, { data, error, loading, fetchMore }] =
    useGetAllDocumentsLazyQuery();

  useEffect(() => {
    if (language) {
      getAllDocuments({
        variables: {
          input: {
            filter: filter.trim(),
            language_code: language?.lang.tag,
            dialect_code: language?.dialect?.tag || null,
            geo_code: language?.region?.tag || null,
          },
          first: PAGE_SIZE,
          after: null,
        },
      });
      addPaginationVariableForGetAllDocuments({
        input: {
          filter: filter.trim(),
          language_code: language?.lang.tag,
          dialect_code: language?.dialect?.tag || null,
          geo_code: language?.region?.tag || null,
        },
      });
    }
  }, [
    getAllDocuments,
    language,
    filter,
    addPaginationVariableForGetAllDocuments,
  ]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (data?.getAllDocuments.pageInfo.hasNextPage) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: data.getAllDocuments.pageInfo.endCursor,
            filter: filter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, filter, data],
  );

  const documentItems = useMemo(() => {
    if (error || !data) {
      return [];
    }

    return [...data.getAllDocuments.edges].map((edge) => (
      <DocumentItem
        document={edge.node}
        key={edge.node.document_id}
        onClickItem={onClickItem}
      />
    ));
  }, [data, error, onClickItem]);

  return (
    <Stack gap="12px">
      <Box style={{ textAlign: 'center' }}>
        {loading && <CircularProgress />}
      </Box>

      {documentItems}

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>
    </Stack>
  );
}
