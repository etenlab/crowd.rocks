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
import { useGetPericopiesTrQuery } from '../../../generated/graphql';
import { useAppContext } from '../../../hooks/useAppContext';
import { useCallback } from 'react';
import { langInfo2langInput } from '../../../../../utils';
import { PAGE_SIZE } from '../../../const/commonConst';
import { useSubscribeToRecomendedPericopiesChangedSubscription } from '../../../hooks/useCusomSubscribeToRecomendedPericopiesChanged';

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

  const {
    states: {
      global: {
        langauges: {
          documentPage: { source: sourceLang, target: targetLang },
        },
      },
    },
  } = useAppContext();

  const { data: pericopies, fetchMore } = useGetPericopiesTrQuery({
    variables: {
      documentId,
      targetLang: langInfo2langInput(targetLang || { lang: { tag: '' } }),
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

  useSubscribeToRecomendedPericopiesChangedSubscription();

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
        {pericopies ? (
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
          )
        ) : (
          <div style={{ textAlign: 'center' }}>{<CircularProgress />}</div>
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
