import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedWordCards } from '../../word/TranslatedWordCards/TranslatedWordCards';
import { useGetOrigMapWordsLazyQuery } from '../../../generated/graphql';

interface MapTranslationProps extends RouteComponentProps<{}> {}

export const MapTranslation: React.FC<MapTranslationProps> = () => {
  const [sourceLang, setSourceLang] = useState<LanguageInfo>();
  const [targetLang, setTargetLang] = useState<LanguageInfo>();

  const [
    origMapWordsRead,
    {
      data: wordsData,
      // error: wordsError,
      // loading: wordsLoading,
      // called: wordsCalled,
    },
  ] = useGetOrigMapWordsLazyQuery();

  useEffect(() => {
    origMapWordsRead();
  }, [origMapWordsRead]);

  return (
    <>
      <Caption>Map Translation</Caption>
      <LangSelectorBox>
        <LangSelector
          title="Select source language"
          langSelectorId="sourceLangSelector"
          selected={sourceLang}
          onChange={(sourcseLangTag, sourceLangInfo) => {
            setSourceLang(sourceLangInfo);
          }}
        ></LangSelector>
      </LangSelectorBox>

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
          wordsData.getOrigMapWords.origMapWords.map((mw) => (
            <TranslatedWordCards
              key={mw.word_id}
              wordTranslated={{
                word: {
                  content: mw.word,
                  id: mw.word_id,
                  languageCode: mw.language_code,
                },
                translation: {
                  word: {
                    content: 'tr mw.word mocked',
                    id: 'tr mw.word_id mocked',
                    languageCode: 'tr mw.language_code mocked',
                  },
                },
              }}
              targetLang={targetLang}
            />
          ))}
      </WordsBox>
    </>
  );
};

const LangSelectorBox = styled.div`
  margin-top: 10px;
`;

const WordsBox = styled.div`
  margin-top: 10px;
`;
