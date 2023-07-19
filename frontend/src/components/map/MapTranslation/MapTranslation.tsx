import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { mockMapWords } from '../mocks/mapData.mock';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';

interface MapTranslationProps extends RouteComponentProps<{}> {}

export const MapTranslation: React.FC<MapTranslationProps> = () => {
  const [mapsWords, setMapsWords] = useState<TMapWords>();

  const getMapWords = useCallback(async (langInfo?: LanguageInfo) => {
    console.log(`mock words for lang ${JSON.stringify(langInfo)}`);
    const words = mockMapWords;
    setMapsWords(words);
  }, []);

  useEffect(() => {
    getMapWords();
  }, [getMapWords]);

  return (
    <>
      <Caption>Map Translation</Caption>
      <StDiv>
        <LangSelector
          onChange={(langTag, langInfo) => {
            getMapWords(langInfo);
          }}
        ></LangSelector>
      </StDiv>
    </>
  );
};

const StDiv = styled.div`
  margin: 20px 50px;

  border: 1px solid gray;
`;
