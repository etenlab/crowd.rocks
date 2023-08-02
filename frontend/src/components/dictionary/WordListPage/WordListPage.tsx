import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  useIonRouter,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';
import { IonContent, IonPage, useIonToast } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';
import { Input } from '../../common/styled';

import {
  useGetWordsByLanguageLazyQuery,
  useToggleWordVoteStatusMutation,
} from '../../../generated/graphql';

import {
  WordWithVoteListOutput,
  WordWithDefinitionlikeStrings,
  WordWithVote,
  ErrorType,
} from '../../../generated/graphql';

import {
  WordWithDefinitionlikeStringsFragmentFragmentDoc,
  WordWithVoteFragmentFragmentDoc,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  FilterContainer,
  CardListContainer,
  CardContainer,
} from './styled';

interface WordListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function WordListPage({ match }: WordListPageProps) {
  const router = useIonRouter();
  const [present] = useIonToast();

  const [langInfo, setLangInfo] = useState<LanguageInfo>();
  const [filter, setFilter] = useState<string>('');

  const [wordWithVoteList, setWordWithVoteList] =
    useState<WordWithVoteListOutput>();

  const [getWordsByLanguage, { data: wordsData, error, loading, called }] =
    useGetWordsByLanguageLazyQuery();
  const [toggleWordVoteStatus] = useToggleWordVoteStatusMutation({
    update(cache, { data, errors }) {
      if (errors) {
        console.log('useToggleWordVoteStatusMutation: ', errors);

        present({
          message: 'Failed at voting!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (!wordsData || !data || !data.toggleWordVoteStatus.vote_status) {
        return;
      }

      if (!langInfo) {
        return;
      }

      const newVoteStatus = data.toggleWordVoteStatus.vote_status;

      cache.updateFragment<WordWithDefinitionlikeStrings>(
        {
          id: cache.identify({
            __typename: 'WordWithDefinitionlikeStrings',
            word_id: newVoteStatus.word_id,
          }),
          fragment: WordWithDefinitionlikeStringsFragmentFragmentDoc,
          fragmentName: 'WordWithDefinitionlikeStringsFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );

      cache.updateFragment<WordWithVote>(
        {
          id: cache.identify({
            __typename: 'WordWithVote',
            word_id: newVoteStatus.word_id,
          }),
          fragment: WordWithVoteFragmentFragmentDoc,
          fragmentName: 'WordWithVoteFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );
    },
  });

  useEffect(() => {
    if (!langInfo) {
      return;
    }

    getWordsByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
        filter: filter,
      },
    });
  }, [langInfo, getWordsByLanguage, filter]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (wordsData) {
      if (wordsData.getWordsByLanguage.error !== ErrorType.NoError) {
        return;
      }
      setWordWithVoteList(wordsData.getWordsByLanguage);
    }
  }, [wordsData, error, loading, called]);

  const handleGoToDefinitionDetail = useCallback(
    (wordId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-detail/${wordId}`,
      );
    },
    [match, router],
  );

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const words = useMemo(() => {
    const tempWords: {
      word_id: string;
      word: string;
      definitionlike_strings: string[];
      downvotes: number;
      upvotes: number;
    }[] = [];

    if (!wordWithVoteList) {
      return tempWords;
    }

    for (const wordWithVote of wordWithVoteList.word_with_vote_list) {
      if (wordWithVote) {
        tempWords.push({
          word_id: wordWithVote.word_id,
          word: wordWithVote.word,
          definitionlike_strings:
            wordWithVote.definitionlike_strings as string[],
          upvotes: wordWithVote.upvotes,
          downvotes: wordWithVote.downvotes,
        });
      }
    }

    return tempWords;
  }, [wordWithVoteList]);

  const cardListComs = words
    ? words.map((word) => (
        <CardContainer key={word.word_id}>
          <Card
            key={word.word_id}
            content={word.word}
            description={
              <ul style={{ listStyleType: 'circle' }}>
                {word.definitionlike_strings.map((str) => (
                  <li key={str}>{str}</li>
                ))}
              </ul>
            }
            vote={{
              upVotes: word.upvotes,
              downVotes: word.downvotes,
              onVoteUpClick: () => {
                toggleWordVoteStatus({
                  variables: {
                    word_id: word.word_id,
                    vote: true,
                  },
                });
              },
              onVoteDownClick: () => {
                toggleWordVoteStatus({
                  variables: {
                    word_id: word.word_id,
                    vote: false,
                  },
                });
              },
            }}
            voteFor="content"
            onClick={() => handleGoToDefinitionDetail(word.word_id)}
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
              <Caption>Dictionary</Caption>
            </CaptainContainer>

            <FilterContainer>
              <LangSelector
                title="Select language"
                langSelectorId="langSelector"
                selected={langInfo}
                onChange={(_sourceLangTag, sourceLangInfo) => {
                  setLangInfo(sourceLangInfo);
                }}
              />
              <Input
                type="text"
                placeholder="Search..."
                labelPlacement="floating"
                label="Search"
                fill="outline"
                debounce={300}
                value={filter}
                onIonInput={handleFilterChange}
              />
            </FilterContainer>

            <br />

            <CardListContainer>{cardListComs}</CardListContainer>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
