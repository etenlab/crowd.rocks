import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedWordCards } from '../../word/TranslatedWordCards/TranslatedWordCards';
import { useGetOrigMapWordsLazyQuery } from '../../../generated/graphql';
import { WordTranslationsCom } from './WordTranslationsCom';

interface MapWordsTranslationProps extends RouteComponentProps<{}> {}

export const MapWordsTranslation: React.FC<MapWordsTranslationProps> = () => {
  // const [sourceLang, setSourceLang] = useState<LanguageInfo>();
  const [targetLang, setTargetLang] = useState<LanguageInfo>();
  const [selectedWordId, setSelectedWordId] = useState<string>();

  const [origMapWordsRead, { data: wordsData }] = useGetOrigMapWordsLazyQuery();

  const fetchMapWords = useCallback(() => {
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
  }, [
    origMapWordsRead,
    targetLang?.dialect?.tag,
    targetLang?.lang.tag,
    targetLang?.region?.tag,
  ]);

  useEffect(() => {
    fetchMapWords();
  }, [fetchMapWords]);

  const selectedWord = useMemo(
    () =>
      wordsData?.getOrigMapWords.origMapWords.find(
        (omw) => omw.word_id === selectedWordId,
      ),
    [selectedWordId, wordsData?.getOrigMapWords.origMapWords],
  );

  return (
    <>
      {!selectedWord || !targetLang ? (
        <>
          <Caption>Map Translation</Caption>
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
              title="Select target language"
              langSelectorId="targetLangSelector"
              selected={targetLang}
              onChange={(targetLangTag, targetLangInfo) => {
                setTargetLang(targetLangInfo);
              }}
            ></LangSelector>
          </LangSelectorBox>
          <WordsBox>
            {wordsData &&
              wordsData.getOrigMapWords.origMapWords.map((omw) => (
                <TranslatedWordCards
                  key={omw.word_id}
                  wordTranslated={omw}
                  onClick={() => setSelectedWordId(omw.word_id)}
                />
              ))}
          </WordsBox>
        </>
      ) : (
        <WordTranslationsCom
          tLangInfo={targetLang}
          wordWithTranslations={selectedWord}
          onBackClick={() => {
            setSelectedWordId(undefined);
          }}
          fetchMapWordsFn={() => fetchMapWords()}
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
