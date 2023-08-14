import { useState, useEffect, useMemo } from 'react';

import { Card } from '../../common/Card';

import {
  useGetPhrasesByLanguageLazyQuery,
  useGetWordsByLanguageLazyQuery,
} from '../../../generated/graphql';

import {
  PhraseWithVoteListOutput,
  WordWithVoteListOutput,
  ErrorType,
} from '../../../generated/graphql';

import {} from '../../../generated/graphql';

import { CardListContainer, CardContainer, Button, CardUl } from './styled';

interface WordOrPhraseListProps {
  langInfo: LanguageInfo | null;
  filter?: string;
  onClickDefinition(
    definitionId: number,
    is_word_definition: boolean,
    more?: { wordOrPhrase: string; definition: string },
  ): void;
}

export function WordOrPhraseList({
  langInfo,
  filter,
  onClickDefinition,
}: WordOrPhraseListProps) {
  const [wordWithVoteList, setWordWithVoteList] =
    useState<WordWithVoteListOutput>();

  const [phraseWithVoteList, setPhraseWithVoteList] =
    useState<PhraseWithVoteListOutput>();

  const [
    getWordsByLanguage,
    {
      data: wordsData,
      error: wordsError,
      loading: wordsLoading,
      called: wordsCalled,
    },
  ] = useGetWordsByLanguageLazyQuery();
  const [
    getPhrasesByLanguage,
    {
      data: phrasesData,
      error: phraseError,
      loading: phraseLoading,
      called: phraseCalled,
    },
  ] = useGetPhrasesByLanguageLazyQuery();

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

  useEffect(() => {
    if (wordsError) {
      return;
    }

    if (wordsLoading || !wordsCalled) {
      return;
    }

    if (wordsData) {
      if (wordsData.getWordsByLanguage.error !== ErrorType.NoError) {
        return;
      }
      setWordWithVoteList(wordsData.getWordsByLanguage);
    }
  }, [wordsData, wordsError, wordsLoading, wordsCalled]);

  useEffect(() => {
    if (phraseError) {
      return;
    }

    if (phraseLoading || !phraseCalled) {
      return;
    }

    if (phrasesData) {
      if (phrasesData.getPhrasesByLanguage.error !== ErrorType.NoError) {
        return;
      }
      setPhraseWithVoteList(phrasesData.getPhrasesByLanguage);
    }
  }, [phrasesData, phraseError, phraseLoading, phraseCalled]);

  const wordAndPhrases = useMemo(() => {
    const tempWordAndPhrases: {
      id: string;
      wordOrPhrase: string;
      definitions: {
        id: string;
        is_word_definition: boolean;
        definition: string;
      }[];
    }[] = [];

    if (wordWithVoteList) {
      for (const wordWithVote of wordWithVoteList.word_with_vote_list) {
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

    if (phraseWithVoteList) {
      for (const phraseWithVote of phraseWithVoteList.phrase_with_vote_list) {
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

    return tempWordAndPhrases;
  }, [wordWithVoteList, phraseWithVoteList]);

  const cardListComs = wordAndPhrases
    ? wordAndPhrases.map((wordOrPhrase) => (
        <CardContainer key={wordOrPhrase.id}>
          <Card
            content={wordOrPhrase.wordOrPhrase}
            description={
              wordOrPhrase.definitions.length > 0 ? (
                <CardUl>
                  {wordOrPhrase.definitions.map((definition) => (
                    <li key={definition.id}>
                      <Button
                        fill="outline"
                        onClick={() => {
                          onClickDefinition(
                            +definition.id,
                            definition.is_word_definition,
                            {
                              wordOrPhrase: wordOrPhrase.wordOrPhrase,
                              definition: definition.definition,
                            },
                          );
                        }}
                      >
                        {definition.definition}
                      </Button>
                    </li>
                  ))}
                </CardUl>
              ) : (
                <div>No definitions</div>
              )
            }
            onClick={() => {}}
          />
        </CardContainer>
      ))
    : null;

  return <CardListContainer>{cardListComs}</CardListContainer>;
}
