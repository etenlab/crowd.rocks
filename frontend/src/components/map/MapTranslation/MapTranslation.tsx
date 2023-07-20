import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { mockMapWords } from '../mocks/mapData.mock';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { WordTranslatedCard } from '../../word/WordTranslatedCard/WordTranslatedCard';

interface MapTranslationProps extends RouteComponentProps<{}> {}

export const MapTranslation: React.FC<MapTranslationProps> = () => {
  const [mapsWords, setMapsWords] = useState<TWordTranslated[]>();
  const [sourceLang, setSourceLang] = useState<LanguageInfo>();
  const [targetLang, setTargetLang] = useState<LanguageInfo>();

  const getMapWords = useCallback(
    async (sourceLang?: LanguageInfo, targetLang?: LanguageInfo) => {
      console.log(`mock words for source lang ${JSON.stringify(sourceLang)}`);
      console.log(`mock words for target lang ${JSON.stringify(targetLang)}`);
      const words = mockMapWords;
      setMapsWords(words);
    },
    [setMapsWords],
  );

  useEffect(() => {
    getMapWords(sourceLang, targetLang);
  }, [getMapWords, sourceLang, targetLang]);

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
        {mapsWords?.map((mw) => (
          <WordTranslatedCard key={mw.word.id} wordTranslated={mw} />
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
