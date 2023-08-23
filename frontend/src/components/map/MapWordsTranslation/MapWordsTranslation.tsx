import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedCards } from '../../word/TranslatedWordCards/TranslatedWordCards';
import {
  useGetOrigMapPhrasesLazyQuery,
  useGetOrigMapWordsLazyQuery,
  MapPhraseTranslations,
  WordTranslations,
  WordWithVotes,
  MapPhraseWithVotes,
} from '../../../generated/graphql';
import { TranslationsCom } from './TranslationsCom';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

interface MapWordsTranslationProps extends RouteComponentProps {}
type TWordOrPhraseId = { word_id: string } | { phrase_id: string };

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

  //const [targetLang, setTargetLang] = useState<LanguageInfo>();
  const [selectedId, setSelectedId] = useState<TWordOrPhraseId>();

  const [origMapWordsRead, { data: wordsData }] = useGetOrigMapWordsLazyQuery();
  const [origMapPhrasesRead, { data: phrasesData }] =
    useGetOrigMapPhrasesLazyQuery();

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
    fetchMapWordsAndPhrases();
  }, [fetchMapWordsAndPhrases]);

  const selected = useMemo(() => {
    // make common prop 'value' for words and phrases and translations
    // to be able to use common components
    let res:
      | ((WordTranslations | MapPhraseTranslations) & {
          value?: string | undefined;
        })
      | undefined;
    if (selectedId && 'word_id' in selectedId) {
      res = wordsData?.getOrigMapWords.origMapWords.find(
        (omw) => omw.word_id === selectedId.word_id,
      );
      if (res) res.value = res?.word;
    } else if (selectedId && 'phrase_id' in selectedId) {
      res = phrasesData?.getOrigMapPhrases.origMapPhrases.find(
        (ph) => ph.phrase_id === selectedId.phrase_id,
      );
      if (res) res.value = res?.phrase;
    }
    if (!res) return null;
    const res1 = JSON.parse(JSON.stringify(res)) as (
      | WordTranslations
      | MapPhraseTranslations
    ) & {
      value: string;
      translations: [(WordWithVotes | MapPhraseWithVotes) & { value: string }];
    };

    if (res1?.translations) {
      res1?.translations.forEach(
        (tr: (WordWithVotes | MapPhraseWithVotes) & { value: string }, i) => {
          if ('word' in tr) {
            res1.translations[i] = { ...tr, value: tr.word || '' };
          } else if ('phrase' in tr) {
            res1.translations[i] = { ...tr, value: tr.phrase || '' };
          }
        },
      );
    }
    return res1;
  }, [
    phrasesData?.getOrigMapPhrases.origMapPhrases,
    selectedId,
    wordsData?.getOrigMapWords.origMapWords,
  ]);

  return (
    <>
      {!selected || !targetLang ? (
        <>
          <Caption>{tr('Map Translation')}</Caption>
          {/* <LangSelectorBox>  // source language is always 'English' for now, so we don't need this selector yet
            <LangSelector
              title="Select source language"
              langSelectorId="sourceLangSelector"
              selected={sourceLang}
              onChange={(sourcseLangTag, sourceLangInfo) => {
                setSourceLang(sourceLangInfo);
              }}
            ></LangSelector>
          </LangSelectorBox> */}
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
            {wordsData &&
              wordsData.getOrigMapWords.origMapWords
                .sort((omw1, omw2) => omw1.word.localeCompare(omw2.word))
                .map((omw) => (
                  <TranslatedCards
                    key={omw.word_id}
                    wordTranslated={omw}
                    onClick={() => setSelectedId({ word_id: omw.word_id })}
                  />
                ))}
          </WordsBox>
          <WordsBox>
            {phrasesData &&
              phrasesData.getOrigMapPhrases.origMapPhrases
                .sort((ph1, ph2) => ph1.phrase.localeCompare(ph2.phrase))
                .map((ph) => (
                  <TranslatedCards
                    key={ph.phrase_id}
                    wordTranslated={ph}
                    onClick={() => setSelectedId({ phrase_id: ph.phrase_id })}
                  />
                ))}
          </WordsBox>
        </>
      ) : (
        <TranslationsCom
          tLangInfo={targetLang}
          wordOrPhraseWithTranslations={selected}
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
