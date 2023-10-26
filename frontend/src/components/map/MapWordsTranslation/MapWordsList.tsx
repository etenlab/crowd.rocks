import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { SearchInput } from '../../common/forms/SearchInput';
import { FilterList } from '../../common/icons/FilterList';
import { MapWordItem } from './MapWordItem';
// import { Select, OptionItem } from '../../common/forms/Select';

import { useGetOrigMapWordsAndPhrasesLazyQuery } from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { PAGE_SIZE } from '../../../const/commonConst';
import { MapNavigationModal } from './MapNavigationModal';

export function MapWordsList() {
  const { tr } = useTr();
  const { id } = useParams<{
    id: string;
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  // const filterOptions = useMemo(
  //   () => [
  //     {
  //       label: tr('All'),
  //       value: 'all',
  //     },
  //     {
  //       label: tr('Translated'),
  //       value: 'translated',
  //     },
  //     {
  //       label: tr('Not Translated'),
  //       value: 'not translated',
  //     },
  //   ],
  //   [tr],
  // );

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [filter, setFilter] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<string | null>('');
  // const [filterOption, setFilterOption] = useState<OptionItem>({
  //   label: tr('All'),
  //   value: 'all',
  // });

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [getWordsAndPhrases, { data: wordsAndPhrases, fetchMore, loading }] =
    useGetOrigMapWordsAndPhrasesLazyQuery();

  useEffect(() => {
    if (!loading) {
      getWordsAndPhrases({
        variables: {
          lang: {
            language_code: DEFAULT_MAP_LANGUAGE_CODE,
          },
          original_map_id: id && id !== 'all' ? id : null,
          filter,
          quickFilter,
          // onlyNotTranslated:
          //   filterOption.value === 'not translated' ? true : null,
          // onlyTranslated: filterOption.value === 'translated' ? true : null,
          onlyNotTranslated: null,

          onlyTranslated: null,

          first: PAGE_SIZE,
        },
      });
    }
  }, [
    getWordsAndPhrases,
    targetLang,
    filter,
    id,
    // filterOption,
    quickFilter,
    loading,
  ]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage) {
        const variables = {
          lang: {
            language_code: DEFAULT_MAP_LANGUAGE_CODE,
          },
          original_map_id: id && id !== 'all' ? id : null,
          filter,
          quickFilter,
          // onlyNotTranslated:
          //   filterOption.value === 'not translated' ? true : null,
          // onlyTranslated: filterOption.value === 'translated' ? true : null,
          onlyNotTranslated: null,
          onlyTranslated: null,
          first: PAGE_SIZE,
          after: wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.endCursor,
        };

        await fetchMore({
          variables,
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [
      wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage,
      wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.endCursor,
      id,
      filter,
      quickFilter,
      // filterOption.value,
      fetchMore,
    ],
  );

  // const handleChangeFilterOption = useCallback((value: OptionItem | null) => {
  //   if (value) {
  //     setFilterOption(value);
  //   }
  // }, []);

  const handleOpenFilterModal = () => {
    openModal(
      <MapNavigationModal
        onClose={closeModal}
        setQuickFilter={setQuickFilter}
      />,
    );
  };

  return (
    <>
      <Caption>{tr('Translation')}</Caption>

      <Stack gap="14px">
        <LangSelector
          title={tr('Select target language')}
          selected={targetLang}
          onChange={(_targetLangTag, targetLangInfo) => {
            if (targetLangInfo) {
              setTargetLanguage(targetLangInfo);
            }
          }}
          onClearClick={() =>
            setTargetLanguage({
              lang: {
                tag: 'en',
                descriptions: ['English'],
              },
            })
          }
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="16px"
        >
          <Stack sx={{ flex: 1 }}>
            {/* <Select
              placeholder={tr('Select sort filter')}
              options={filterOptions}
              value={filterOption}
              onChange={handleChangeFilterOption}
              onClear={() => {
                setFilterOption({
                  label: tr('All'),
                  value: 'all',
                });
              }}
            /> */}
          </Stack>
          <Button
            variant="contained"
            onClick={handleOpenFilterModal}
            color="gray_bg"
            sx={{
              padding: '10px',
              minWidth: '20px',
              border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
            }}
          >
            <FilterList sx={{ fontSize: 24 }} />
          </Button>
        </Stack>

        <SearchInput
          value={filter}
          onChange={handleFilterChange}
          onClickSearchButton={() => {}}
          placeholder={tr('Search by words...')}
        />
      </Stack>
      {quickFilter && (
        <Stack>
          <Typography
            variant="h2"
            sx={{ color: (theme) => theme.palette.text.gray }}
          >
            {quickFilter}
          </Typography>
        </Stack>
      )}

      <Stack gap="16px">
        <div style={{ textAlign: 'center' }}>
          {loading && <CircularProgress />}
        </div>
        {wordsAndPhrases &&
          wordsAndPhrases.getOrigMapWordsAndPhrases.edges.map(
            (omw) =>
              omw.node && <MapWordItem key={omw.cursor} original={omw.node} />,
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
