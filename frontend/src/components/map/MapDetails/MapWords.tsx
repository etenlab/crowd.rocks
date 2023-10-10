import { useCallback, useEffect } from 'react';
import { styled } from 'styled-components';
import { TranslatedCards } from '../MapWordsTranslation/TranslatedCards';
import { useTr } from '../../../hooks/useTr';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
// import { PAGE_SIZE } from '../../../const/commonConst';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';
import {
  MapWordOrPhrase,
  useGetSingleMapWordsAndPhrasesLazyQuery,
} from '../../../generated/graphql';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonRouter,
} from '@ionic/react';

const PAGE_SIZE = 5;
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
    useGetSingleMapWordsAndPhrasesLazyQuery();

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (wordsAndPhrases?.getSingleMapWordsAndPhrases.pageInfo.hasNextPage) {
        const variables = {
          lang: {
            language_code: DEFAULT_MAP_LANGUAGE_CODE,
          },
          first: PAGE_SIZE,
          after:
            wordsAndPhrases?.getSingleMapWordsAndPhrases.pageInfo.endCursor,
          original_map_id,
        };

        await fetchMore({
          variables,
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [
      wordsAndPhrases?.getSingleMapWordsAndPhrases.pageInfo.hasNextPage,
      wordsAndPhrases?.getSingleMapWordsAndPhrases.pageInfo.endCursor,
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
          <WordsDiv>
            {wordsAndPhrases &&
              wordsAndPhrases.getSingleMapWordsAndPhrases.edges.map(
                (omw, i) => (
                  <TranslatedCards
                    key={i}
                    wordOrPhrase={omw.node}
                    onClick={() => handleWordOrPhraseSelect(omw.node)}
                  />
                ),
              )}
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
