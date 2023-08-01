import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { useIonRouter } from '@ionic/react';
import { IonContent, IonPage } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';
import { Input } from '../../common/styled';

import {
  useGetWordsByLanguageLazyQuery,
  WordWithVoteListOutput,
  useToggleWordVoteStatusMutation,
  ErrorType,
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
  const [getWordsByLanguage, { data, error, loading, called }] =
    useGetWordsByLanguageLazyQuery();
  const [
    toggleWordVoteStatus,
    {
      data: voteData,
      error: voteError,
      loading: voteLoading,
      called: voteCalled,
    },
  ] = useToggleWordVoteStatusMutation();

  const [langInfo, setLangInfo] = useState<LanguageInfo>();
  const [wordWithVoteList, setWordWithVoteList] =
    useState<WordWithVoteListOutput>();

  useEffect(() => {
    if (!langInfo) {
      return;
    }

    getWordsByLanguage({
      variables: {
        language_code: langInfo.lang.tag,
        dialect_code: langInfo.dialect ? langInfo.dialect.tag : null,
        geo_code: langInfo.region ? langInfo.region.tag : null,
      },
    });
  }, [langInfo, getWordsByLanguage]);

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
      if (data.getWordsByLanguage.error !== ErrorType.NoError) {
        console.log(data.getWordsByLanguage.error);
        alert(data.getWordsByLanguage.error);
        return;
      }
      setWordWithVoteList(data.getWordsByLanguage);
    }
  }, [data, error, loading, called]);

  useEffect(() => {
    if (voteError) {
      console.log(voteError);
      alert('Error');

      return;
    }

    if (voteLoading || !voteCalled) {
      return;
    }

    if (voteData) {
      if (voteData.toggleWordVoteStatus.error !== ErrorType.NoError) {
        console.log(voteData.toggleWordVoteStatus.error);
        alert(voteData.toggleWordVoteStatus.error);
        return;
      }

      const vote_status = voteData.toggleWordVoteStatus.vote_status;

      if (vote_status) {
        setWordWithVoteList((_wordWithVoteList) => {
          if (!_wordWithVoteList) {
            return _wordWithVoteList;
          }

          return {
            ..._wordWithVoteList,
            word_with_vote_list: _wordWithVoteList?.word_with_vote_list.map(
              (wordWithVote) => {
                if (!wordWithVote) {
                  return wordWithVote;
                }

                if (wordWithVote.word_id === vote_status.word_id) {
                  return {
                    ...wordWithVote,
                    upvotes: vote_status.upvotes,
                    downvotes: vote_status.downvotes,
                  };
                } else {
                  return wordWithVote;
                }
              },
            ),
          };
        });
      }
    }
  }, [voteError, voteLoading, voteCalled, voteData]);

  const handleGoToDefinitionDetail = useCallback(
    (wordId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-detail/${wordId}`,
      );
    },
    [match, router],
  );

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
