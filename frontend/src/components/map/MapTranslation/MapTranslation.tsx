import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { mockMapWords } from '../mocks/mapData.mock';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
} from '@ionic/react';
import { WordTranslationCard } from '../../common/WordTranslationCard/WordTranslationCard';

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
      <LangSelectorBox>
        <LangSelector
          onChange={(langTag, langInfo) => {
            getMapWords(langInfo);
          }}
        ></LangSelector>
      </LangSelectorBox>
      <WordsBox>
        {mapsWords?.map((mw) => (
          <WordTranslationCard
            key={mw.id}
            wordWithTranslations={{
              word: { content: mw.content, id: mw.id, languageCode: 'en' },
              translations: [
                { id: 3, content: 'some translation3', languageCode: 'en' },
                { id: 4, content: 'some translation4', languageCode: 'en' },
              ],
            }}
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
