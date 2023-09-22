import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedCards } from '../../word/TranslatedWordCards/TranslatedCards';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { DEFAULT_MAP_LANGUAGE_CODE } from '../../../const/mapsConst';
import { PAGE_SIZE } from '../../../const/commonConst';
import { useGetOrigMapWordsAndPhrasesLazyQuery } from '../../../generated/graphql';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

interface MapWordsTranslationProps extends RouteComponentProps {}
export type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

export const MapWordsTranslation: React.FC<MapWordsTranslationProps> = () => {
  const { tr } = useTr();
  // const router = useIonRouter();

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [selectedId, setSelectedId] = useState<string>();
  // const [getWordAndPhrases, { data: wordsAndPhrases, fetchMore }] =
  const [getWordAndPhrases, { data: wordsAndPhrases, fetchMore }] =
    useGetOrigMapWordsAndPhrasesLazyQuery({});

  useEffect(() => {
    getWordAndPhrases({
      variables: {
        lang: {
          language_code: DEFAULT_MAP_LANGUAGE_CODE,
        },
        first: PAGE_SIZE,
      },
    });
  }, [getWordAndPhrases, targetLang]);

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

  // const nation = router.routeInfo.pathname.split('/')[1];
  // const language_id = router.routeInfo.pathname.split('/')[2];

  return (
    <>
      {!selectedId || !targetLang ? (
        <>
          <Caption>{tr('Map Translation')}</Caption>
          <LangSelectorBox>
            <LangSelector
              title={tr('Select target language')}
              langSelectorId="targetLangSelector"
              selected={targetLang ?? undefined}
              onChange={(_targetLangTag, targetLangInfo) => {
                setTargetLanguage(targetLangInfo);
              }}
            />
          </LangSelectorBox>
          <WordsDiv>
            {wordsAndPhrases &&
              wordsAndPhrases.getOrigMapWordsAndPhrases.edges.map((omw, i) => (
                <TranslatedCards
                  key={i}
                  wordOrPhrase={omw.node}
                  onClick={() => setSelectedId(omw.node.id)}
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
        // <TranslationsCom
        //   tLangInfo={targetLang}
        //   wordOrPhraseWithTranslations={selected}
        //   nation_id={nation}
        //   language_id={language_id}
        //   onBackClick={() => {
        //     setSelectedId(undefined);
        //   }}
        // />
        <>{selectedId}</>
      )}
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;

const WordsDiv = styled.div`
  margin-top: 10px;
`;
