// todo: deprecated in favor of MapWordsListPaginated. Check usability of the new one and then delete this file.

import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedCards } from './TranslatedCards';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { PAGE_SIZE } from '../../../const/commonConst';
import {
  MapWordOrPhrase,
  useGetOrigMapWordsAndPhrasesLazyQuery,
} from '../../../generated/graphql';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InputCustomEvent,
  InputChangeEventDetail,
  useIonRouter,
} from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import { FilterContainer, Input } from '../../common/styled';

interface MapWordsTranslationProps extends RouteComponentProps {}
export type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

export const MapWordsList: React.FC<MapWordsTranslationProps> = () => {
  const { tr } = useTr();
  const router = useIonRouter();
  const [filter, setFilter] = useState<string>('');

  const handleFilterChange = useCallback(
    (event: InputCustomEvent<InputChangeEventDetail>) => {
      setFilter(event.detail.value || '');
    },
    [setFilter],
  );

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
        filter,
        first: PAGE_SIZE,
      },
    });
  }, [getWordsAndPhrases, targetLang, filter]);

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
              langSelectorId="targetLangSelector"
              selected={targetLang ?? undefined}
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
            {wordsAndPhrases &&
              wordsAndPhrases.getOrigMapWordsAndPhrases.edges.map((omw, i) => (
                <TranslatedCards
                  key={i}
                  wordOrPhrase={omw.node}
                  onClick={() => handleWordOrPhraseSelect(omw.node)}
                />
              ))}
          </WordsDiv>
          <IonInfiniteScroll onIonInfinite={handleInfinite}>
            <IonInfiniteScrollContent
              loadingText={`${tr('Loading')}...`}
              loadingSpinner="bubbles"
            />
          </IonInfiniteScroll>
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
