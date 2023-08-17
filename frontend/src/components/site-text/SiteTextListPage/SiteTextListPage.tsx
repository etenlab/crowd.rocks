import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from 'react';
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
} from '../../../generated/graphql';

import { GetAllSiteTextDefinitionsDocument } from '../../../generated/graphql';

import {
  SiteTextDefinitionListOutput,
  GetAllSiteTextDefinitionsQuery,
  ErrorType,
  useIsAdminLoggedInQuery,
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

import { sortSiteTextFn } from '../../../common/langUtils';
import { globals } from '../../../services/globals';
import { AddFab } from '../../common/AddFab';

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

  const [allSiteTextDefinitions, setAllSiteTextDefinitions] =
    useState<SiteTextDefinitionListOutput>();

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const [showModal, setShowModal] = useState(false);

  const user_id = globals.get_user_id();
  const variables = { input: { user_id: String(user_id) } };
  const { data: isAdminRes } = useIsAdminLoggedInQuery({
    variables: variables,
  });

  const [getAllSiteTextDefinitions, { data, error, loading, called }] =
    useGetAllSiteTextDefinitionsLazyQuery();
  const [siteTextUpsert] = useSiteTextUpsertMutation({
    update(cache, { data: upsertData, errors }) {
      if (
        !errors &&
        upsertData &&
        upsertData.siteTextUpsert.error === ErrorType.NoError
      ) {
        const newSiteTextDefinition =
          upsertData.siteTextUpsert.site_text_definition;

        if (!newSiteTextDefinition) {
          return;
        }

        cache.updateQuery<GetAllSiteTextDefinitionsQuery>(
          {
            query: GetAllSiteTextDefinitionsDocument,
            variables: {
              filter,
            },
          },
          (data) => {
            if (
              data &&
              data.getAllSiteTextDefinitions.site_text_definition_list
            ) {
              const alreadyExists =
                data.getAllSiteTextDefinitions.site_text_definition_list.filter(
                  (site_text_definition) =>
                    site_text_definition.__typename ===
                      newSiteTextDefinition.__typename &&
                    site_text_definition.site_text_id ===
                      newSiteTextDefinition.site_text_id,
                );

              if (alreadyExists.length > 0) {
                return data;
              }

              return {
                ...data,
                getAllSiteTextDefinitions: {
                  ...data.getAllSiteTextDefinitions,
                  site_text_definition_list: [
                    ...data.getAllSiteTextDefinitions.site_text_definition_list,
                    newSiteTextDefinition,
                  ],
                },
              };
            } else {
              return data;
            }
          },
        );

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
          message: `${tr('Failed at creating new site text!')} [${
            upsertData?.siteTextUpsert.error || ''
          }]`,
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
    setShowModal(false);
  };

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const cardListComs = useMemo(() => {
    const tempDefinitions: {
      siteTextId: string;
      isWord: boolean;
      siteTextlikeString: string;
      definitionlikeString: string;
    }[] = [];

    if (
      !allSiteTextDefinitions ||
      !allSiteTextDefinitions.site_text_definition_list
    ) {
      return null;
    }

    for (const siteTextDefinition of allSiteTextDefinitions.site_text_definition_list) {
      switch (siteTextDefinition.__typename) {
        case 'SiteTextWordDefinition': {
          tempDefinitions.push({
            siteTextId: siteTextDefinition.site_text_id,
            isWord: true,
            siteTextlikeString: siteTextDefinition.word_definition.word.word,
            definitionlikeString: siteTextDefinition.word_definition.definition,
          });
          break;
        }
        case 'SiteTextPhraseDefinition': {
          tempDefinitions.push({
            siteTextId: siteTextDefinition.site_text_id,
            isWord: false,
            siteTextlikeString:
              siteTextDefinition.phrase_definition.phrase.phrase,
            definitionlikeString:
              siteTextDefinition.phrase_definition.definition,
          });
          break;
        }
      }
    }

    tempDefinitions.sort(sortSiteTextFn);

    return tempDefinitions.map((definition) => (
      <Fragment
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
      </Fragment>
    ));
  }, [allSiteTextDefinitions, handleGoToDefinitionDetail, targetLang]);

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
                  onChange={(_targetLangTag, targetLangInfo) => {
                    setTargetLanguage(targetLangInfo);
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

            <hr />
            {isAdminRes?.loggedInIsAdmin.isAdmin && (
              <AddFab
                title={tr('Site Text Strings')}
                onClick={() => setShowModal(true)}
              />
            )}
            <hr />

            <CardListContainer>{cardListComs}</CardListContainer>

            <IonModal ref={modal} isOpen={showModal}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowModal(false)}>
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
