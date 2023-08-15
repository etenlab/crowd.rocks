import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonPage,
  IonBadge,
  useIonRouter,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  useIonToast,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';

import {
  useGetAllSiteTextDefinitionsLazyQuery,
  useSiteTextUpsertMutation,
  SiteTextDefinitionListOutput,
  GetAllSiteTextDefinitionsDocument,
  ErrorType,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  LangSelectorContainer,
  AppLanguageShowerContainer,
  CardListContainer,
  CardContainer,
} from './styled';

import { useTr } from '../../../hooks/useTr';

import { Input } from '../../common/styled';
import { useAppContext } from '../../../hooks/useAppContext';
import { TranslatedCard } from './TranslatedCard';
import React from 'react';

interface SiteTextListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function SiteTextListPage({ match }: SiteTextListPageProps) {
  const router = useIonRouter();
  const [present] = useIonToast();
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [filter, setFilter] = useState<string>('');
  //const [targetLang, setTargetLang] = useState<LanguageInfo>();
  const [allSiteTextDefinitions, setAllSiteTextDefinitions] =
    useState<SiteTextDefinitionListOutput>();

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const [getAllSiteTextDefinitions, { data, error, loading, called }] =
    useGetAllSiteTextDefinitionsLazyQuery();
  const [siteTextUpsert] = useSiteTextUpsertMutation({
    update(cache, { data: upsertData, errors }) {
      if (
        !errors &&
        upsertData &&
        upsertData.siteTextUpsert.error === ErrorType.NoError &&
        data &&
        data.getAllSiteTextDefinitions.error === ErrorType.NoError
      ) {
        let wordDefinitionList =
          data.getAllSiteTextDefinitions.site_text_word_definition_list;
        let phraseDefinitionList =
          data.getAllSiteTextDefinitions.site_text_phrase_definition_list;

        if (upsertData.siteTextUpsert.site_text_word_definition) {
          const newSiteTextWordDefinition =
            upsertData.siteTextUpsert.site_text_word_definition;

          wordDefinitionList = [
            ...wordDefinitionList.filter(
              (wordDefinition) =>
                wordDefinition?.site_text_id !==
                newSiteTextWordDefinition.site_text_id,
            ),
            newSiteTextWordDefinition,
          ];
        }

        if (upsertData.siteTextUpsert.site_text_phrase_definition) {
          const newSiteTextPhraseDefinition =
            upsertData.siteTextUpsert.site_text_phrase_definition;

          phraseDefinitionList = [
            ...phraseDefinitionList.filter(
              (phraseDefinition) =>
                phraseDefinition?.site_text_id !==
                newSiteTextPhraseDefinition.site_text_id,
            ),
            newSiteTextPhraseDefinition,
          ];
        }

        cache.writeQuery({
          query: GetAllSiteTextDefinitionsDocument,
          data: {
            ...data,
            getAllSiteTextDefinitions: {
              ...data.getAllSiteTextDefinitions,
              site_text_phrase_definition_list: phraseDefinitionList,
              site_text_word_definition_list: wordDefinitionList,
            },
          },
          variables: {
            filter,
          },
        });

        present({
          message: tr('Success at creating new site text!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('useSiteTextUpsertMutation: ', errors);
        console.log(upsertData?.siteTextUpsert.error);

        present({
          message: `${tr('Failed at creating new site text!')} [${upsertData
            ?.siteTextUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });

  useEffect(() => {
    getAllSiteTextDefinitions({
      variables: {
        filter,
      },
    });
  }, [getAllSiteTextDefinitions, filter]);

  useEffect(() => {
    if (error) {
      console.log(error);
      present({
        message: tr('Error!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (loading || !called) {
      return;
    }

    if (data) {
      if (data.getAllSiteTextDefinitions.error !== ErrorType.NoError) {
        console.log(data.getAllSiteTextDefinitions.error);

        present({
          message: data.getAllSiteTextDefinitions.error,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      setAllSiteTextDefinitions(data.getAllSiteTextDefinitions);
    }
  }, [data, error, loading, called, present, tr]);

  const handleGoToDefinitionDetail = useCallback(
    (siteTextId: string, isWord: boolean) => {
      if (!targetLang) {
        present({
          message: tr('Should select target language!'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

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
    [
      targetLang,
      router,
      match.params.nation_id,
      match.params.language_id,
      present,
      tr,
    ],
  );

  const handleSaveNewSiteText = () => {
    const inputEl = input.current;

    if (!inputEl) {
      present({
        message: tr('Input element not exists!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const inputVal = (inputEl.value + '').trim();

    if (inputVal.length === 0) {
      present({
        message: tr('Invalid input'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    siteTextUpsert({
      variables: {
        siteTextlike_string: inputVal,
        definitionlike_string: 'Site User Interface Text',
        language_code: 'en',
        dialect_code: null,
        geo_code: null,
      },
    });
  };

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

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
        <React.Fragment
          key={`${definition.isWord ? 'word' : 'phrase'}-${
            definition.siteTextId
          }`}
        >
          <CardContainer>
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
          <CardContainer>
            <TranslatedCard
              siteTextId={definition.siteTextId}
              isWord={definition.isWord}
              languageInfo={targetLang}
              onClick={() =>
                handleGoToDefinitionDetail(
                  definition.siteTextId,
                  definition.isWord,
                )
              }
            />
          </CardContainer>
        </React.Fragment>
      ))
    : null;

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <CaptainContainer>
              <Caption>{tr('Site Text')}</Caption>
            </CaptainContainer>

            <LangSelectorContainer>
              <AppLanguageShowerContainer>
                <label style={{ fontSize: '14px', display: 'flex' }}>
                  {tr('App Language')}:
                </label>
                <IonBadge color="primary">English</IonBadge>
              </AppLanguageShowerContainer>

              <AppLanguageShowerContainer>
                <label style={{ fontSize: '14px', display: 'flex' }}>
                  {tr('Translation')}:
                </label>
                <LangSelector
                  title={tr('Select')}
                  langSelectorId="site-text-targetLangSelector"
                  selected={targetLang ?? undefined}
                  onChange={(_sourceLangTag, sourceLangInfo) => {
                    setTargetLanguage(sourceLangInfo);
                  }}
                  onClearClick={() => setTargetLanguage(null)}
                />
              </AppLanguageShowerContainer>
            </LangSelectorContainer>

            <Input
              type="text"
              label={tr('Search')}
              labelPlacement="floating"
              fill="outline"
              debounce={300}
              value={filter}
              onIonInput={handleFilterChange}
            />

            <br />

            <IonButton id="open-site-text-modal" expand="block">
              + {tr('Add More Site Text')}
            </IonButton>

            <br />

            <CardListContainer>{cardListComs}</CardListContainer>

            <IonModal ref={modal} trigger="open-site-text-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      {tr('Cancel')}
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{tr('Add Site Text')}</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <Input
                    ref={input}
                    type="text"
                    label={tr('Site Text')}
                    labelPlacement="floating"
                    fill="outline"
                  />

                  <IonButton onClick={handleSaveNewSiteText}>
                    {tr('Save')}
                  </IonButton>
                </div>
              </IonContent>
            </IonModal>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
