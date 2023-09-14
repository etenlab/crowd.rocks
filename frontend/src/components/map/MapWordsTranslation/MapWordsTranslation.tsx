import { useCallback, useEffect, useMemo, useState } from 'react';
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
  WordOrPhraseWithValueAndTranslations,
  useMapTranslationTools,
} from '../hooks/useMapTranslationTools';
import { useIonRouter } from '@ionic/react';

interface MapWordsTranslationProps extends RouteComponentProps {}
export type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

export const MapWordsTranslation: React.FC<MapWordsTranslationProps> = () => {
  const { tr } = useTr();
  const router = useIonRouter();

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
  const [wordsAndPhrases, setWordsAndPhrases] = useState<
    WordOrPhraseWithValueAndTranslations[]
  >([]);

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
    setWordsAndPhrases([
      ...addValueToWordsOrPhrases(
        wordsData?.getOrigMapWords.origMapWords.map((data) => ({
          ...data,
          is_word_type: true,
        })) as WordOrPhraseWithValueAndTranslations[],
      ),
      ...addValueToWordsOrPhrases(
        phrasesData?.getOrigMapPhrases.origMapPhrases.map((data) => ({
          ...data,
          is_word_type: false,
        })) as WordOrPhraseWithValueAndTranslations[],
      ),
    ]);
  }, [wordsData, phrasesData, addValueToWordsOrPhrases]);

  useEffect(() => {
    fetchMapWordsAndPhrases();
  }, [fetchMapWordsAndPhrases]);

  const selected = useMemo(() => {
    let res: WordOrPhraseWithValueAndTranslations | undefined;
    if (selectedId && 'word_id' in selectedId) {
      res = wordsAndPhrases.find(
        (wap) =>
          wap.__typename === 'MapWordTranslations' &&
          wap.word_id === selectedId.word_id,
      );
    } else if (selectedId && 'phrase_id' in selectedId) {
      res = wordsAndPhrases.find(
        (wap) =>
          wap.__typename === 'MapPhraseTranslations' &&
          wap.phrase_id === selectedId.phrase_id,
      );
    }
    return res;
  }, [selectedId, wordsAndPhrases]);
  const nation = router.routeInfo.pathname.split('/')[1];
  const language_id = router.routeInfo.pathname.split('/')[2];

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
            {wordsAndPhrases
              .sort((omw1, omw2) => {
                if (!omw1.value || !omw2.value) return 0;
                return omw1.value.localeCompare(omw2.value);
              })
              .map((omw, i) => (
                <TranslatedCards
                  key={i}
                  wordTranslated={omw}
                  onClick={() => {
                    omw.__typename === 'MapWordTranslations' &&
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
          wordOrPhraseWithTranslations={selected}
          nation_id={nation}
          language_id={language_id}
          onBackClick={() => {
            setSelectedId(undefined);
          }}
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
