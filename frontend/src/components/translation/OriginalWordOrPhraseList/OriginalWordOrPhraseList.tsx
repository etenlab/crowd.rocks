import { useEffect, useMemo, useState } from 'react';
import {
  IonButton,
  IonSpinner,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonRadio,
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';

import { Card } from '../../common/Card';
import { AddListHeader } from '../../common/ListHeader';

import {
  useGetPhrasesByLanguageLazyQuery,
  useGetWordsByLanguageLazyQuery,
} from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';

import { NoDefinition, CustomIonRadioGroup, CardContainer } from './styled';
import { WordOrPhraseListContainer } from '../styled';

import { NewWordOrPhraseWithDefinitionForm } from '../NewWordOrPhraseWithDefinitionForm';

import { PAGE_SIZE } from '../../../const/commonConst';

interface OriginalWordOrPhraseListProps {
  listLabel?: string;
  langInfo: LanguageInfo | null;
  filter?: string;
  onChangeOriginalDefinition(
    definitionId: number,
    is_word_definition: boolean,
  ): void;
  selectedValue?: string;
}

export function OriginalWordOrPhraseList({
  listLabel,
  langInfo,
  filter,
  selectedValue,
  onChangeOriginalDefinition,
}: OriginalWordOrPhraseListProps) {
  const { tr } = useTr();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [
    getWordsByLanguage,
    {
      data: wordsData,
      error: wordsError,
      loading: wordsLoading,
      fetchMore: wordsFetchMore,
    },
  ] = useGetWordsByLanguageLazyQuery();
  const [
    getPhrasesByLanguage,
    {
      data: phrasesData,
      error: phraseError,
      loading: phrasesLoading,
      fetchMore: phrasesFetchMore,
    },
  ] = useGetPhrasesByLanguageLazyQuery();

  useEffect(() => {
    if (!langInfo) {
      return;
    }

    getWordsByLanguage({
      variables: {
        first: PAGE_SIZE,
        after: null,
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : '',
      },
    });

    getPhrasesByLanguage({
      variables: {
        first: PAGE_SIZE,
        after: null,
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : '',
      },
    });
  }, [langInfo, getWordsByLanguage, getPhrasesByLanguage, filter]);

  const handleFetchMore = () => {
    if (wordsData?.getWordsByLanguage.pageInfo.hasNextPage && langInfo) {
      wordsFetchMore({
        variables: {
          first: PAGE_SIZE,
          after: wordsData.getWordsByLanguage.pageInfo.endCursor,
          language_code: langInfo.lang.tag,
          dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
          geo_code: langInfo.region ? langInfo.region.tag : null,
          filter: filter ? filter.trim() : '',
        },
      });
    }

    if (phrasesData?.getPhrasesByLanguage.pageInfo.hasNextPage && langInfo) {
      phrasesFetchMore({
        variables: {
          first: PAGE_SIZE,
          after: phrasesData.getPhrasesByLanguage.pageInfo.endCursor,
          language_code: langInfo.lang.tag,
          dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
          geo_code: langInfo.region ? langInfo.region.tag : null,
          filter: filter ? filter.trim() : '',
        },
      });
    }
  };

  const cardListComs = useMemo(() => {
    const tempWordAndPhrases: {
      id: string;
      wordOrPhrase: string;
      definitions: {
        id: string;
        is_word_definition: boolean;
        definition: string;
      }[];
    }[] = [];

    const wordWithVoteListEdges =
      !wordsError &&
      wordsData &&
      wordsData.getWordsByLanguage.error === ErrorType.NoError
        ? wordsData.getWordsByLanguage.edges
        : null;

    if (wordWithVoteListEdges) {
      for (const edge of wordWithVoteListEdges) {
        const { node } = edge;

        if (node) {
          tempWordAndPhrases.push({
            id: `word_${node.word_id}`,
            wordOrPhrase: node.word,
            definitions: node.definitions
              .filter((definition) => definition)
              .map((definition) => ({
                id: definition!.word_definition_id,
                is_word_definition: true,
                definition: definition!.definition,
              })),
          });
        }
      }
    }

    const phraseWithVoteListEdges =
      !phraseError &&
      phrasesData &&
      phrasesData.getPhrasesByLanguage.error === ErrorType.NoError
        ? phrasesData.getPhrasesByLanguage.edges
        : null;

    if (phraseWithVoteListEdges) {
      for (const edge of phraseWithVoteListEdges) {
        const { node } = edge;

        if (node) {
          tempWordAndPhrases.push({
            id: `phrase_${node.phrase_id}`,
            wordOrPhrase: node.phrase,
            definitions: node.definitions
              .filter((definition) => definition)
              .map((definition) => ({
                id: definition!.phrase_definition_id,
                is_word_definition: false,
                definition: definition!.definition,
              })),
          });
        }
      }
    }

    return tempWordAndPhrases
      .sort((a, b) => {
        if (a.wordOrPhrase < b.wordOrPhrase) {
          return -1;
        } else if (a.wordOrPhrase > b.wordOrPhrase) {
          return 1;
        } else {
          return 0;
        }
      })
      .filter((wordOrPhrase) => wordOrPhrase.definitions.length > 0)
      .map((wordOrPhrase) => (
        <IonItemGroup
          key={wordOrPhrase.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
          }}
        >
          <IonItemDivider>
            <IonLabel>{wordOrPhrase.wordOrPhrase}</IonLabel>
          </IonItemDivider>

          {wordOrPhrase.definitions.length > 0 ? (
            wordOrPhrase.definitions.map((definition) => (
              <CardContainer key={definition.id}>
                <Card
                  description={definition.definition}
                  onClick={() => {
                    onChangeOriginalDefinition(
                      +definition.id,
                      definition.is_word_definition,
                    );
                  }}
                />
                <IonRadio
                  value={`${
                    definition.is_word_definition ? 'word' : 'phrase'
                  }_${definition.id}`}
                  onClick={() => {
                    onChangeOriginalDefinition(
                      +definition.id,
                      definition.is_word_definition,
                    );
                  }}
                />
              </CardContainer>
            ))
          ) : (
            <NoDefinition>{tr('No definitions')}</NoDefinition>
          )}
        </IonItemGroup>
      ));
  }, [
    wordsError,
    wordsData,
    phraseError,
    phrasesData,
    tr,
    onChangeOriginalDefinition,
  ]);

  return (
    <WordOrPhraseListContainer>
      <AddListHeader
        title={listLabel || tr('Original')}
        onClick={() => setIsOpenModal(true)}
      />

      <CustomIonRadioGroup value={selectedValue}>
        {cardListComs}
      </CustomIonRadioGroup>

      <IonButton
        fill="outline"
        shape="round"
        onClick={handleFetchMore}
        disabled={
          !wordsData?.getWordsByLanguage.pageInfo.hasNextPage &&
          !phrasesData?.getPhrasesByLanguage.pageInfo.hasNextPage
        }
      >
        {tr('Load More')}
        {wordsLoading || phrasesLoading ? <IonSpinner name="bubbles" /> : null}
      </IonButton>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {langInfo ? (
            <NewWordOrPhraseWithDefinitionForm
              langInfo={langInfo}
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
    </WordOrPhraseListContainer>
  );
}
