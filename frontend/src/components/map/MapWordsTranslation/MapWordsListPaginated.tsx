import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedCards } from './TranslatedCards';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import {
  MapWordOrPhrase,
  useGetOrigMapWordsAndPhrasesCountLazyQuery,
  useGetOrigMapWordsAndPhrasesPaginatedLazyQuery,
} from '../../../generated/graphql';
import {
  InputCustomEvent,
  InputChangeEventDetail,
  useIonRouter,
  IonButton,
} from '@ionic/react';
import { FilterContainer, Input } from '../../common/styled';

export const ITEMS_ON_PAGE = 5;

interface MapWordsTranslationProps extends RouteComponentProps {}
export type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

export const MapWordsListPaginated: React.FC<MapWordsTranslationProps> = () => {
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();
  const { tr } = useTr();
  const router = useIonRouter();

  const [filter, setFilter] = useState<string>('');

  const [pageParams, setPageParams] = useState<{
    pages: number[];
    currentPage?: number;
    offset?: number;
    limit?: number;
  }>({ pages: [] });

  const handleFilterChange = useCallback(
    (event: InputCustomEvent<InputChangeEventDetail>) => {
      setFilter(event.detail.value || '');
    },
    [setFilter],
  );

  const [getWordsAndPhrasesCount, { data: wordsAndPhrasesCount }] =
    useGetOrigMapWordsAndPhrasesCountLazyQuery();

  const [getWordsAndPhrases, { data: wordsAndPhrases }] =
    useGetOrigMapWordsAndPhrasesPaginatedLazyQuery();

  useEffect(() => {
    getWordsAndPhrasesCount({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        filter,
      },
    });
  }, [targetLang, filter, getWordsAndPhrasesCount]);

  useEffect(() => {
    if (
      isNaN(Number(wordsAndPhrasesCount?.getOrigMapWordsAndPhrasesCount.count))
    ) {
      return;
    }
    const pagesCount = Math.ceil(
      wordsAndPhrasesCount!.getOrigMapWordsAndPhrasesCount!.count! /
        ITEMS_ON_PAGE,
    );
    const pages = new Array(pagesCount).fill(1).map((v, i) => i + 1);
    setPageParams({
      pages,
      currentPage: 1,
      offset: 0,
      limit: ITEMS_ON_PAGE,
    });
  }, [
    wordsAndPhrasesCount,
    wordsAndPhrasesCount?.getOrigMapWordsAndPhrasesCount.count,
  ]);

  useEffect(() => {
    if (!pageParams.currentPage) {
      return;
    }
    getWordsAndPhrases({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        filter,
        offset: pageParams.offset,
        limit: pageParams.limit,
      },
    });
  }, [
    filter,
    getWordsAndPhrases,
    pageParams.offset,
    pageParams.limit,
    pageParams.currentPage,
  ]);

  const handleChangePage = (page: number) => {
    setPageParams((oldPageParams) => {
      const offset = (page - 1) * ITEMS_ON_PAGE;
      const limit = ITEMS_ON_PAGE;

      return {
        ...oldPageParams,
        currentPage: page,
        offset,
        limit,
      };
    });
  };

  const nation_id = router.routeInfo.pathname.split('/')[1];
  const language_id = router.routeInfo.pathname.split('/')[2];
  const handleWordOrPhraseSelect = useCallback(
    (wordOrPhrase: MapWordOrPhrase) => {
      router.push(
        `/${nation_id}/${language_id}/1/maps/translate_word/${wordOrPhrase.o_definition_id}/${wordOrPhrase.type}`,
      );
    },
    [language_id, nation_id, router],
  );

  return (
    <>
      {targetLang ? (
        <>
          <Caption>{tr('Map Translation')}</Caption>
          <FilterContainer>
            <LangSelector
              title={tr('Select target language')}
              selected={targetLang}
              onChange={(_targetLangTag, targetLangInfo) => {
                setTargetLanguage(targetLangInfo);
              }}
            />
            <Input
              type="text"
              label={tr('Search original')}
              labelPlacement="floating"
              fill="outline"
              debounce={500}
              value={filter}
              onIonInput={handleFilterChange}
            />
          </FilterContainer>
          <WordsDiv>
            {wordsAndPhrases?.getOrigMapWordsAndPhrasesPaginated
              ?.mapWordsOrPhrases &&
              wordsAndPhrases.getOrigMapWordsAndPhrasesPaginated.mapWordsOrPhrases.map(
                (omw, i) => (
                  <TranslatedCards
                    key={i}
                    wordOrPhrase={omw}
                    onClick={() => handleWordOrPhraseSelect(omw)}
                  />
                ),
              )}
          </WordsDiv>
          <div>
            {pageParams.pages.map((page) => (
              <IonButton
                color={
                  page === pageParams.currentPage ? 'secondary' : 'primary'
                }
                key={page}
                onClick={() => handleChangePage(page)}
              >
                {page}
              </IonButton>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const WordsDiv = styled.div`
  margin-top: 10px;
`;
