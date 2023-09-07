import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonBadge,
  useIonRouter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonToast,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';

import { useGetAllSiteTextDefinitionsLazyQuery } from '../../../generated/graphql';

import { ErrorType, useIsAdminLoggedInQuery } from '../../../generated/graphql';

import {
  AppLanguageShowerContainer,
  CardContainer,
  CardListContainer,
} from './styled';

import {
  Input,
  CaptionContainer,
  LanguageSelectorContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { NewSiteTextForm } from '../NewSiteTextForm';
import { TranslatedCard } from './TranslatedCard';

import { sortSiteTextFn } from '../../../common/langUtils';
import { globals } from '../../../services/globals';
import { AddListHeader } from '../../common/ListHeader';
import { PageLayout } from '../../common/PageLayout';

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

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const user_id = globals.get_user_id();
  const variables = { input: { user_id: String(user_id) } };
  const { data: isAdminRes } = useIsAdminLoggedInQuery({
    variables: variables,
  });

  const [getAllSiteTextDefinitions, { data, error }] =
    useGetAllSiteTextDefinitionsLazyQuery();

  useEffect(() => {
    getAllSiteTextDefinitions({
      variables: {
        filter,
      },
    });
  }, [getAllSiteTextDefinitions, filter]);

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

      router.push(
        `/${match.params.nation_id}/${
          match.params.language_id
        }/1/site-text-detail/${isWord ? 'word' : 'phrase'}/${siteTextId}`,
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

    if (error) {
      return null;
    }

    if (!data || data.getAllSiteTextDefinitions.error !== ErrorType.NoError) {
      return null;
    }

    const allSiteTextDefinitions =
      data.getAllSiteTextDefinitions.site_text_definition_list;

    if (!allSiteTextDefinitions) {
      return null;
    }

    for (const siteTextDefinition of allSiteTextDefinitions) {
      if (!siteTextDefinition) {
        continue;
      }

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
  }, [data, error, handleGoToDefinitionDetail, targetLang]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Site Text')}</Caption>
      </CaptionContainer>

      <LanguageSelectorContainer>
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
      </LanguageSelectorContainer>

      <Input
        type="text"
        label={tr('Search')}
        labelPlacement="floating"
        fill="outline"
        debounce={300}
        value={filter}
        onIonInput={handleFilterChange}
      />

      {isAdminRes?.loggedInIsAdmin.isAdmin && (
        <AddListHeader
          title={tr('Site Text Strings')}
          onClick={() => setIsOpenModal(true)}
        />
      )}

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Site Text')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {targetLang ? (
            <NewSiteTextForm
              onCreated={() => {
                setIsOpenModal(false);
              }}
              onCancel={() => {
                setIsOpenModal(false);
              }}
            />
          ) : null}
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
