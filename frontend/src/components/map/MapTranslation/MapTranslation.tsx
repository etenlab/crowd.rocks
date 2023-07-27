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
          wordsData.getOrigMapWords.origMapWords.map((omw) => (
            <TranslatedWordCards
              key={omw.word_id}
              wordTranslated={{
                word: {
                  content: omw.word,
                  id: omw.word_id,
                  languageCode: omw.language_code,
                  dialectCode: omw.dialect_code || undefined,
                  geoCode: omw.geo_code || undefined,
                  definition: omw.definition || '',
                },
                translation: {
                  content: omw.translations?.[0]?.word || '',
                  id: omw.translations?.[0]?.word_id || '',
                  languageCode: omw.translations?.[0]?.language_code || '',
                  dialectCode: omw.translations?.[0]?.dialect_code || undefined,
                  geoCode: omw.translations?.[0]?.geo_code || undefined,
                  definition: omw.translations?.[0]?.definition || '',
                  upVotes: Number(omw.translations?.[0]?.up_votes || 0),
                  downVotes: Number(omw.translations?.[0]?.down_votes || 0),
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
