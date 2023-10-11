import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { TranslatedCards } from '../MapWordsTranslation/TranslatedCards';
import { useTr } from '../../../hooks/useTr';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { PAGE_SIZE } from '../../../const/commonConst';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
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
import { Input } from '../../common/styled';

export interface MapWordsProps {
  nation_id: string;
  language_id: string;
  original_map_id: string;
  targetLang: LanguageInfo;
}

export const MapWords: React.FC<MapWordsProps> = ({
  nation_id,
  language_id,
  original_map_id,
  targetLang,
}: MapWordsProps) => {
  const { tr } = useTr();
  const router = useIonRouter();

  const [getWordsAndPhrases, { data: wordsAndPhrases, fetchMore }] =
    useGetOrigMapWordsAndPhrasesLazyQuery();

  const [filter, setFilter] = useState<string>('');
  const handleFilterChange = useCallback(
    (event: InputCustomEvent<InputChangeEventDetail>) => {
      setFilter(event.detail.value || '');
    },
    [setFilter],
  );

  useEffect(() => {
    getWordsAndPhrases({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        original_map_id,
        filter,
        first: PAGE_SIZE,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.hasNextPage) {
        const variables = {
          lang: {
            language_code: DEFAULT_MAP_LANGUAGE_CODE,
          },
          first: PAGE_SIZE,
          after: wordsAndPhrases?.getOrigMapWordsAndPhrases.pageInfo.endCursor,
          original_map_id,
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
      original_map_id,
      fetchMore,
    ],
  );

  useEffect(() => {
    getWordsAndPhrases({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        original_map_id,
        first: PAGE_SIZE,
      },
    });
  }, [getWordsAndPhrases, original_map_id, targetLang]);

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
          <Input
            type="text"
            label={tr('Search original')}
            labelPlacement="floating"
            fill="outline"
            debounce={500}
            value={filter}
            onIonInput={handleFilterChange}
          />
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
