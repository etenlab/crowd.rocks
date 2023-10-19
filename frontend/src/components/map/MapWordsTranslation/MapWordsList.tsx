import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonRouter,
} from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { Button, Stack, Typography } from '@mui/material';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { SearchInput } from '../../common/forms/SearchInput';
import { Search } from '../../common/icons/Search';
import { FilterList } from '../../common/icons/FilterList';
import { WordItem } from '../../common/WordItem';

import {
  MapWordOrPhrase,
  useGetOrigMapWordsAndPhrasesLazyQuery,
} from '../../../generated/graphql';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { PAGE_SIZE } from '../../../const/commonConst';
import { MapFilterModal } from './MapFilterModal';

export function MapWordsList() {
  const { tr } = useTr();
  const router = useIonRouter();
  const { nation_id, language_id, id } = useParams<{
    id: string;
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    actions: { setTempTranslation, createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const [filter, setFilter] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

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

  const [getWordsAndPhrases, { data: wordsAndPhrases, fetchMore }] =
    useGetOrigMapWordsAndPhrasesLazyQuery();

  useEffect(() => {
    getWordsAndPhrases({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        original_map_id: id && id !== 'all' ? id : null,
        filter,
        first: PAGE_SIZE,
      },
    });
  }, [getWordsAndPhrases, targetLang, filter, id]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage) {
        const variables = {
          lang: {
            language_code: DEFAULT_MAP_LANGUAGE_CODE,
          },
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
      fetchMore,
    ],
  );

  const handleWordOrPhraseSelect = useCallback(
    (wordOrPhrase: MapWordOrPhrase) => {
      router.push(
        `/${nation_id}/${language_id}/1/maps/translate_word/${wordOrPhrase.o_definition_id}/${wordOrPhrase.type}`,
      );
    },
    [language_id, nation_id, router],
  );

  const handleConfirm = useCallback(
    (
      translation: string,
      description: string,
      wordOrPhrase: MapWordOrPhrase,
    ) => {
      setTempTranslation(
        `${wordOrPhrase.o_definition_id}:${wordOrPhrase.type}`,
        { translation, description },
      );
      if (id === 'all') {
        router.push(
          `/${nation_id}/${language_id}/1/maps/translation_confirm/${wordOrPhrase.o_definition_id}/${wordOrPhrase.type}`,
        );
      } else {
        router.push(
          `/${nation_id}/${language_id}/1/maps/translation_confirm/${wordOrPhrase.o_definition_id}/${wordOrPhrase.type}?original_map_id=${id}`,
        );
      }
    },
    [language_id, nation_id, router, setTempTranslation, id],
  );

  const handleOpenFilterModal = () => {
    openModal(<MapFilterModal onChange={() => {}} onClose={closeModal} />);
  };

  const toggleSearchInput = () => {
    setShowSearchInput((value) => !value);
  };

  const searchInputCom = showSearchInput ? (
    <SearchInput
      value={filter}
      onChange={handleFilterChange}
      onClickSearchButton={() => {}}
      placeholder={tr('Search by country/city...')}
    />
  ) : null;

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
        >
          <Typography variant="h3" color="text.dark">
            {tr('All Strings')}
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap="14px"
          >
            <Button
              variant="outlined"
              color="blue"
              sx={{ padding: '6px 12px' }}
              startIcon={<FilterList sx={{ fontSize: 24 }} />}
              onClick={handleOpenFilterModal}
            >
              {tr('Filter')}
            </Button>
            <Button
              variant="contained"
              onClick={toggleSearchInput}
              color="gray_bg"
              sx={{
                padding: '6px',
                minWidth: '20px',
                border: (theme) =>
                  `1px solid ${theme.palette.text.gray_stroke}`,
              }}
            >
              <Search sx={{ fontSize: 24 }} />
            </Button>
          </Stack>
        </Stack>

        {searchInputCom}
      </Stack>

      <Stack gap="16px">
        {wordsAndPhrases &&
          wordsAndPhrases.getOrigMapWordsAndPhrases.edges.map((omw) => (
            <WordItem
              key={omw.cursor}
              word={omw.node.o_like_string}
              description={omw.node.o_definition}
              onConfirm={(translation, description) => {
                handleConfirm(translation, description, omw.node);
              }}
              onDetail={() => handleWordOrPhraseSelect(omw.node)}
            />
          ))}
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
