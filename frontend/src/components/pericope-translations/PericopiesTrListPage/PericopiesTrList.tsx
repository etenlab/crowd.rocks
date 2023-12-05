import { CircularProgress, Stack } from '@mui/material';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import { PericopeTrItem } from './PericopeTrItem';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonToast,
} from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { FilterKind } from '../../super-tool/SuperDocumentViewerPage/ToolBox';
import { useGetPericopiesTrLazyQuery } from '../../../generated/graphql';
import { useAppContext } from '../../../hooks/useAppContext';
import { useCallback, useEffect } from 'react';
import { langInfo2langInput } from '../../../../../utils';
import { PAGE_SIZE } from '../../../const/commonConst';

export type PericopiesTrListProps = {
  documentId: string;
  filterKind: FilterKind;
  stringFilter: string;
};

export function PericopiesTrList({
  documentId,
  filterKind,
  stringFilter,
}: PericopiesTrListProps) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const [getPericopiesTr, { data: pericopies, fetchMore, loading }] =
    useGetPericopiesTrLazyQuery();

  const {
    states: {
      global: {
        langauges: { sourceLang, targetLang },
      },
    },
  } = useAppContext();

  useEffect(() => {
    if (!targetLang) {
      present({
        message: tr('Target language is not defined'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }
    if (!loading) {
      getPericopiesTr({
        variables: {
          documentId,
          targetLang: langInfo2langInput(targetLang),
          filter: stringFilter,
          onlyNotTranslatedTo:
            filterKind === FilterKind.NotTranslated && targetLang
              ? langInfo2langInput(targetLang)
              : null,
          onlyTranslatedTo:
            filterKind === FilterKind.Translated && targetLang
              ? langInfo2langInput(targetLang)
              : null,
          first: PAGE_SIZE,
        },
      });
    }
  }, [
    getPericopiesTr,
    targetLang,
    loading,
    sourceLang,
    present,
    tr,
    documentId,
    stringFilter,
    filterKind,
  ]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (!sourceLang || !targetLang) {
        present({
          message: tr('Target language is not defined'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      if (pericopies?.getPericopiesTr.pageInfo.hasNextPage) {
        const variables = {
          targetLang: langInfo2langInput(targetLang),
          filter: stringFilter,
          onlyNotTranslatedTo:
            filterKind === FilterKind.NotTranslated && targetLang
              ? langInfo2langInput(targetLang)
              : null,
          onlyTranslatedTo:
            filterKind === FilterKind.Translated && targetLang
              ? langInfo2langInput(targetLang)
              : null,
          first: PAGE_SIZE,
          after: pericopies?.getPericopiesTr.pageInfo.endCursor,
        };

        await fetchMore({
          variables,
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [
      sourceLang,
      targetLang,
      pericopies?.getPericopiesTr.pageInfo.hasNextPage,
      pericopies?.getPericopiesTr.pageInfo.endCursor,
      present,
      tr,
      stringFilter,
      filterKind,
      fetchMore,
    ],
  );
  return (
    <>
      <Stack gap="16px">
        <div style={{ textAlign: 'center' }}>
          {loading && <CircularProgress />}
        </div>
        {pericopies &&
          pericopies.getPericopiesTr.edges.map(
            (pericopeTr) =>
              pericopeTr.node && (
                <PericopeTrItem
                  key={pericopeTr.cursor}
                  pericopeId={pericopeTr.node.pericope_id || ''}
                  original={{
                    text: pericopeTr.node.pericope_text,
                    description: pericopeTr.node.pericope_description_text,
                  }}
                  translation={{
                    text: pericopeTr.node.translation?.translation || '',
                    description:
                      pericopeTr.node.translation?.translation_description ||
                      '',
                  }}
                />
              ),
          )}
      </Stack>

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>
    </>
  );
}
