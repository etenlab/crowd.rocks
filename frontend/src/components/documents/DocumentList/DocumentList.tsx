import { useMemo } from 'react';
import // IonInfiniteScroll,
// IonInfiniteScrollContent,
'@ionic/react';
// import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { Stack, Box, CircularProgress } from '@mui/material';

// import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useGetAllDocumentsQuery } from '../../../generated/graphql';

import { DocumentItem } from './DocumentItem';

type DocumentListProps = {
  onClickItem(documentId: string): void;
};

export function DocumentList({ onClickItem }: DocumentListProps) {
  // const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
  } = useAppContext();

  const { data, error, loading } = useGetAllDocumentsQuery({
    variables: {
      languageInput: sourceLang
        ? {
            language_code: sourceLang?.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          }
        : undefined,
    },
  });

  // const handleInfinite = useCallback(
  //   async (ev: IonInfiniteScrollCustomEvent<void>) => {
  //     if (foldersData?.getForumFoldersList.pageInfo.hasNextPage) {
  //       await fetchMore({
  //         variables: {
  //           first: PAGE_SIZE,
  //           after: foldersData.getForumFoldersList.pageInfo.endCursor,
  //           filter: bouncedFilter.trim(),
  //         },
  //       });
  //     }

  //     setTimeout(() => ev.target.complete(), 500);
  //   },
  //   [fetchMore, bouncedFilter, foldersData],
  // );

  const documentItems = useMemo(() => {
    if (error || !data || !data.getAllDocuments.documents) {
      return [];
    }

    return [...data.getAllDocuments.documents]
      .sort((d1, d2) => d1.file_name.localeCompare(d2.file_name))
      .map((d) => (
        <DocumentItem
          document={d}
          key={d.document_id}
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

      {/* <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll> */}
    </Stack>
  );
}
