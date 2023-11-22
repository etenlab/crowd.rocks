import { useDebounce } from 'use-debounce';
import { useTr } from '../../../hooks/useTr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OptionItem, Select } from '../../common/forms/Select';
import { useAppContext } from '../../../hooks/useAppContext';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { langInfo2langInput } from '../../../../../utils/dist';
import { PAGE_SIZE } from '../../../const/commonConst';
import { Caption } from '../../common/Caption/Caption';
import { CircularProgress, Stack } from '@mui/material';
import { SearchInput } from '../../common/forms/SearchInput';
import { PericopeTrItem } from './PericopeTrItem';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';

enum filterOptionsValues {
  ALL = 'all',
  TRANSLATED = 'translated',
  NOT_TRANSLATED = 'not translated',
}

export function PericopiesTrList() {
  const { tr } = useTr();

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

  //todo
  const [getPericopiesTr, { data: pericopies, fetchMore, loading }] =
    useGetPericopiesTrLazyQuery();

  useEffect(() => {
    if (!loading) {
      getPericopiesTr({
        variables: {
          sourceLang: sourceLang,
          targetLang: targetLang,
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
  ]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (pericopies?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage) {
        const variables = {
          sourceLang: sourceLang,
          targetLang: targetLang,
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
          after: pericopies?.getOrigMapWordsAndPhrases.pageInfo.endCursor,
        };

        await fetchMore({
          variables,
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [
      pericopies?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage,
      pericopies?.getOrigMapWordsAndPhrases.pageInfo.endCursor,
      sourceLang,
      targetLang,
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
          pericopies.getOrigMapWordsAndPhrases.edges.map(
            (pericopeTr) =>
              pericopeTr.node && <PericopeTrItem key={pericopeTr.cursor} />,
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
