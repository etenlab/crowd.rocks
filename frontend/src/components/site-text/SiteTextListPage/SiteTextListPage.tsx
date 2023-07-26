import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';

import {
  useGetAllSiteTextDefinitionsLazyQuery,
  SiteTextDefinitionListOutput,
  ErrorType,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  LangSelectorContainer,
  CardListContainer,
  CardContainer,
} from './styled';

interface SiteTextListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function SiteTextListPage({ match }: SiteTextListPageProps) {
  const router = useIonRouter();
  const [getAllSiteTextDefinitions, { data, error, loading, called }] =
    useGetAllSiteTextDefinitionsLazyQuery();

  const [targetLang, setTargetLang] = useState<LanguageInfo>();
  const [allSiteTextDefinitions, setAllSiteTextDefinitions] =
    useState<SiteTextDefinitionListOutput>();

  useEffect(() => {
    getAllSiteTextDefinitions();
  }, [getAllSiteTextDefinitions]);

  useEffect(() => {
    if (error) {
      console.log(error);
      alert('Error');

      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.getAllSiteTextDefinitions.error !== ErrorType.NoError) {
        console.log(data.getAllSiteTextDefinitions.error);
        alert(data.getAllSiteTextDefinitions.error);
        return;
      }
      setAllSiteTextDefinitions(data.getAllSiteTextDefinitions);
    }
  }, [data, error, loading, called]);

  const handleGoToDefinitionDetail = useCallback(
    (siteTextId: string, isWord: boolean) => {
      if (!targetLang) {
        alert('Should select target language!');
        return;
      }

      const queryLangStr = targetLang.lang
        ? `language_code=${targetLang.lang.tag}`
        : null;
      const queryDialectStr = targetLang.dialect
        ? `dialect_code=${targetLang.dialect.tag}`
        : null;
      const queryGeoStr = targetLang.region
        ? `geo_code=${targetLang.region.tag}`
        : null;

      const queryStr = `${queryLangStr}${
        queryDialectStr ? '&' + queryDialectStr : ''
      }${queryGeoStr ? '&' + queryGeoStr : ''}`;

      router.push(
        `/${match.params.nation_id}/${
          match.params.language_id
        }/1/site-text-detail/${
          isWord ? 'word' : 'phrase'
        }/${siteTextId}?${queryStr}`,
      );
    },
    [targetLang, match, router],
  );

  const definitions = useMemo(() => {
    const tempDefinitions: {
      siteTextId: string;
      isWord: boolean;
      siteTextlikeString: string;
      definitionlikeString: string;
    }[] = [];

    if (!allSiteTextDefinitions) {
      return tempDefinitions;
    }

    for (const siteTextWordDefinition of allSiteTextDefinitions.site_text_word_definition_list) {
      if (siteTextWordDefinition) {
        tempDefinitions.push({
          siteTextId: siteTextWordDefinition.site_text_id,
          isWord: true,
          siteTextlikeString: siteTextWordDefinition.word_definition.word.word,
          definitionlikeString:
            siteTextWordDefinition.word_definition.definition,
        });
      }
    }

    for (const siteTextPhraseDefinition of allSiteTextDefinitions.site_text_phrase_definition_list) {
      if (siteTextPhraseDefinition) {
        tempDefinitions.push({
          siteTextId: siteTextPhraseDefinition.site_text_id,
          isWord: false,
          siteTextlikeString:
            siteTextPhraseDefinition.phrase_definition.phrase.phrase,
          definitionlikeString:
            siteTextPhraseDefinition.phrase_definition.definition,
        });
      }
    }

    return tempDefinitions;
  }, [allSiteTextDefinitions]);

  const cardListComs = definitions
    ? definitions.map((definition) => (
        <CardContainer
          key={`${definition.isWord ? 'word' : 'phrase'}-${
            definition.siteTextId
          }`}
        >
          <Card
            content={definition.siteTextlikeString}
            description={definition.definitionlikeString}
            onClick={() =>
              handleGoToDefinitionDetail(
                definition.siteTextId,
                definition.isWord,
              )
            }
          />
        </CardContainer>
      ))
    : null;

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <CaptainContainer>
              <Caption>Site Text</Caption>
            </CaptainContainer>

            <LangSelectorContainer>
              <h4>English</h4>
              <LangSelector
                title="Select target language"
                langSelectorId="targetLangSelector"
                selected={targetLang}
                onChange={(_sourceLangTag, sourceLangInfo) => {
                  setTargetLang(sourceLangInfo);
                }}
              />
            </LangSelectorContainer>

            <CardListContainer>{cardListComs}</CardListContainer>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
