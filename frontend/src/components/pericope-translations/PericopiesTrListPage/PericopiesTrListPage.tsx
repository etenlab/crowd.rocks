import { useDebounce } from 'use-debounce';
import { useTr } from '../../../hooks/useTr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OptionItem, Select } from '../../common/forms/Select';
import { useAppContext } from '../../../hooks/useAppContext';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { langInfo2langInput } from '../../../../../utils';
import { PAGE_SIZE } from '../../../const/commonConst';
import { Caption } from '../../common/Caption/Caption';
import { CircularProgress, Stack } from '@mui/material';
import { SearchInput } from '../../common/forms/SearchInput';
import { PericopeTrItem } from './PericopeTrItem';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonToast,
} from '@ionic/react';
import { useGetPericopiesTrLazyQuery } from '../../../generated/graphql';
import { useParams } from 'react-router';
import { PageLayout } from '../../common/PageLayout';

enum filterOptionsValues {
  ALL = 'all',
  TRANSLATED = 'translated',
  NOT_TRANSLATED = 'not translated',
}

export function PericopiesTrListPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const { tr } = useTr();
  const [present] = useIonToast();

  const filterOptions = useMemo(
    () => [
      {
        label: tr('All'),
        value: filterOptionsValues.ALL,
      },
      {
        label: tr('Translated'),
        value: filterOptionsValues.TRANSLATED,
      },
      {
        label: tr('Not Translated'),
        value: filterOptionsValues.NOT_TRANSLATED,
      },
    ],
    [tr],
  );

  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 500);
  const [filterOption, setFilterOption] = useState<OptionItem>({
    label: tr('All'),
    value: filterOptionsValues.ALL,
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const {
    states: {
      global: {
        langauges: { sourceLang, targetLang },
      },
    },
  } = useAppContext();

  const [getPericopiesTr, { data: pericopies, fetchMore, loading }] =
    useGetPericopiesTrLazyQuery();

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
          filter: debouncedFilter,
          onlyNotTranslatedTo:
            filterOption.value === filterOptionsValues.NOT_TRANSLATED &&
            targetLang
              ? langInfo2langInput(targetLang)
              : null,
          onlyTranslatedTo:
            filterOption.value === filterOptionsValues.TRANSLATED && targetLang
              ? langInfo2langInput(targetLang)
              : null,
          first: PAGE_SIZE,
        },
      });
    }
  }, [
    getPericopiesTr,
    targetLang,
    debouncedFilter,
    filterOption,
    loading,
    sourceLang,
    present,
    tr,
    documentId,
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
          filter: debouncedFilter,
          onlyNotTranslatedTo:
            filterOption.value === filterOptionsValues.NOT_TRANSLATED &&
            targetLang
              ? langInfo2langInput(targetLang)
              : null,
          onlyTranslatedTo:
            filterOption.value === filterOptionsValues.TRANSLATED && targetLang
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
      debouncedFilter,
      filterOption.value,
      fetchMore,
    ],
  );

  const handleChangeFilterOption = useCallback((value: OptionItem | null) => {
    if (value) {
      setFilterOption(value);
    }
  }, []);

  return (
    <>
      <PageLayout>
        <Caption>{tr('Pericopies List')}</Caption>

        <Stack gap="14px">
          <Select
            placeholder={tr('Select sort filter')}
            options={filterOptions}
            value={filterOption}
            onChange={handleChangeFilterOption}
            onClear={() => {
              setFilterOption({
                label: tr('All'),
                value: filterOptionsValues.ALL,
              });
            }}
          />

          <SearchInput
            value={filter}
            onChange={handleFilterChange}
            onClickSearchButton={() => {}}
            placeholder={tr('Search by text strings ...')}
          />
        </Stack>

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
                    original={{
                      text: pericopeTr.node.pericope_text,
                      description: pericopeTr.node.pericope_description_text,
                    }}
                    translation={{
                      text: pericopeTr.node.translation?.translation || '',
                      description:
                        pericopeTr.node.description_translation || '',
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
      </PageLayout>
    </>
  );
}
