import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedCards } from '../../word/TranslatedWordCards/TranslatedWordCards';
import {
  useGetOrigMapPhrasesLazyQuery,
  useGetOrigMapWordsLazyQuery,
} from '../../../generated/graphql';
import { TranslationsCom } from './TranslationsCom';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import {
  WordOrPhraseWithValue,
  useMapTranslationTools,
} from '../hooks/useMapTranslationTools';

interface MapWordsTranslationProps extends RouteComponentProps {}
export type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

export const MapWordsTranslation: React.FC<MapWordsTranslationProps> = () => {
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const { addValueToWordsOrPhrases } = useMapTranslationTools();
  const [selectedId, setSelectedId] = useState<TWordOrPhraseId>();

  const [origMapWordsRead, { data: wordsData }] = useGetOrigMapWordsLazyQuery();
  const [origMapPhrasesRead, { data: phrasesData }] =
    useGetOrigMapPhrasesLazyQuery();
  const wordsAndPhrases = useRef<WordOrPhraseWithValue[]>([]);

  const fetchMapWordsAndPhrases = useCallback(() => {
    if (!targetLang?.lang.tag) {
      return;
    }
    const variables = {
      o_language_code: 'en',
      t_language_code: targetLang.lang.tag,
    };
    targetLang?.dialect?.tag &&
      Object.assign(variables, { t_dialect_code: targetLang.dialect.tag });
    targetLang?.region?.tag &&
      Object.assign(variables, { t_geo_code: targetLang.region.tag });

    origMapWordsRead({ variables, fetchPolicy: 'no-cache' });
    origMapPhrasesRead({ variables, fetchPolicy: 'no-cache' });
  }, [
    origMapPhrasesRead,
    origMapWordsRead,
    targetLang?.lang.tag,
    targetLang?.dialect?.tag,
    targetLang?.region?.tag,
  ]);
  useEffect(() => {
    wordsAndPhrases.current = [
      ...addValueToWordsOrPhrases(
        wordsData?.getOrigMapWords.origMapWords as WordOrPhraseWithValue[],
      ),
      ...addValueToWordsOrPhrases(
        phrasesData?.getOrigMapPhrases
          .origMapPhrases as WordOrPhraseWithValue[],
      ),
    ];
  }, [wordsData, phrasesData, addValueToWordsOrPhrases]);

  useEffect(() => {
    fetchMapWordsAndPhrases();
  }, [fetchMapWordsAndPhrases]);

  const selected = useMemo(() => {
    let res: WordOrPhraseWithValue | undefined;
    if (selectedId && 'word_id' in selectedId) {
      res = wordsAndPhrases.current.find(
        (wap) =>
          wap.__typename === 'WordTranslations' &&
          wap.word_id === selectedId.word_id,
      );
    } else if (selectedId && 'phrase_id' in selectedId) {
      res = wordsAndPhrases.current.find(
        (wap) =>
          wap.__typename === 'MapPhraseTranslations' &&
          wap.phrase_id === selectedId.phrase_id,
      );
    }
    return res;
  }, [selectedId]);

  return (
    <>
      {!selected || !targetLang ? (
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
          <WordsBox>
            {wordsAndPhrases.current
              .sort((omw1, omw2) => {
                if (!omw1.value || !omw2.value) return 0;
                return omw1.value.localeCompare(omw2.value);
              })
              .map((omw, i) => (
                <TranslatedCards
                  key={i}
                  wordTranslated={omw}
                  onClick={() => {
                    omw.__typename === 'WordTranslations' &&
                      setSelectedId({ word_id: omw.word_id });
                    omw.__typename === 'MapPhraseTranslations' &&
                      setSelectedId({ phrase_id: omw.phrase_id });
                  }}
                />
              ))}
          </WordsBox>
        </>
      ) : (
        <TranslationsCom
          tLangInfo={targetLang}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          wordOrPhraseWithTranslations={selected as any}
          onBackClick={() => {
            setSelectedId(undefined);
          }}
          fetchMapWordsFn={() => fetchMapWordsAndPhrases()}
        />
      )}
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;

const WordsBox = styled.div`
  margin-top: 10px;
`;
