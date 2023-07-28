import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { styled } from 'styled-components';
import { TranslatedWordCards } from '../../word/TranslatedWordCards/TranslatedWordCards';
import { useGetOrigMapWordsLazyQuery } from '../../../generated/graphql';
import { WordTranslations } from './WordTranslations';

interface MapWordsTranslationProps extends RouteComponentProps<{}> {}

export const MapWordsTranslation: React.FC<MapWordsTranslationProps> = () => {
  // const [sourceLang, setSourceLang] = useState<LanguageInfo>();
  const [targetLang, setTargetLang] = useState<LanguageInfo>();
  const [selectedWordId, setSelectedWordId] = useState<string | undefined>();

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

    origMapWordsRead({ variables });
  }, [
    origMapWordsRead,
    targetLang?.dialect?.tag,
    targetLang?.lang.tag,
    targetLang?.region?.tag,
  ]);

  return (
    <>
      {!selectedWordId || !targetLang ? (
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
                      dialectCode:
                        omw.translations?.[0]?.dialect_code || undefined,
                      geoCode: omw.translations?.[0]?.geo_code || undefined,
                      definition: omw.translations?.[0]?.definition || '',
                      upVotes: Number(omw.translations?.[0]?.up_votes || 0),
                      downVotes: Number(omw.translations?.[0]?.down_votes || 0),
                    },
                  }}
                  onClick={() => setSelectedWordId(omw.word_id)}
                />
              ))}
          </WordsBox>
        </>
      ) : (
        <WordTranslations
          tLangInfo={targetLang}
          wordId={selectedWordId}
          onBackClick={() => setSelectedWordId(undefined)}
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
