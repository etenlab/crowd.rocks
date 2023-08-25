import { useEffect, useMemo, useState } from 'react';

import {
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

  const [getWordsByLanguage, { data: wordsData, error: wordsError }] =
    useGetWordsByLanguageLazyQuery();
  const [getPhrasesByLanguage, { data: phrasesData, error: phraseError }] =
    useGetPhrasesByLanguageLazyQuery();

  useEffect(() => {
    if (!langInfo) {
      return;
    }

    getWordsByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : null,
      },
    });

    getPhrasesByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter ? filter.trim() : null,
      },
    });
  }, [langInfo, getWordsByLanguage, getPhrasesByLanguage, filter]);

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

    const wordWithVoteList =
      !wordsError &&
      wordsData &&
      wordsData.getWordsByLanguage.error === ErrorType.NoError
        ? wordsData.getWordsByLanguage.word_with_vote_list
        : null;

    if (wordWithVoteList) {
      for (const wordWithVote of wordWithVoteList) {
        if (wordWithVote) {
          tempWordAndPhrases.push({
            id: `word_${wordWithVote.word_id}`,
            wordOrPhrase: wordWithVote.word,
            definitions: wordWithVote.definitions
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

    const phraseWithVoteList =
      !phraseError &&
      phrasesData &&
      phrasesData.getPhrasesByLanguage.error === ErrorType.NoError
        ? phrasesData.getPhrasesByLanguage.phrase_with_vote_list
        : null;

    if (phraseWithVoteList) {
      for (const phraseWithVote of phraseWithVoteList) {
        if (phraseWithVote) {
          tempWordAndPhrases.push({
            id: `phrase_${phraseWithVote.phrase_id}`,
            wordOrPhrase: phraseWithVote.phrase,
            definitions: phraseWithVote.definitions
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
          return 1;
        } else if (a.wordOrPhrase > b.wordOrPhrase) {
          return -1;
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

      <IonModal isOpen={isOpenModal}>
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
