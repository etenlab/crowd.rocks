import { useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonPage,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  useIonToast,
  useIonViewDidEnter,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetWordDefinitionsByWordIdLazyQuery,
  useGetWordWithVoteByIdLazyQuery,
  useToggleWordVoteStatusMutation,
  useWordDefinitionUpsertMutation,
  useToggleWordDefinitonVoteStatusMutation,
  WordDefinitionWithVoteListOutput,
  WordWithVoteOutput,
  WordDefinitionWithVote,
  ErrorType,
} from '../../../generated/graphql';

import { CaptainContainer, CardListContainer, CardContainer } from './styled';
import { Textarea } from '../../common/styled';

interface WordDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    word_id: string;
  }> {}

export function WordDetailPage({ match }: WordDetailPageProps) {
  const [
    getWordDefinitionsByWordId,
    {
      data: definitionData,
      error: definitionError,
      loading: definitionLoading,
      called: definitionCalled,
    },
  ] = useGetWordDefinitionsByWordIdLazyQuery();
  const [
    getWordWithVoteById,
    {
      data: wordData,
      error: wordError,
      loading: wordLoading,
      called: wordCalled,
    },
  ] = useGetWordWithVoteByIdLazyQuery();

  const [
    toggleWordVoteStatus,
    {
      data: wordVoteData,
      error: wordVoteError,
      loading: wordVoteLoading,
      called: wordVoteCalled,
    },
  ] = useToggleWordVoteStatusMutation();
  const [
    toggleWordDefinitionVoteStatus,
    {
      data: wordDefinitionVoteData,
      error: wordDefinitionVoteError,
      loading: wordDefinitionVoteLoading,
    },
  ] = useToggleWordDefinitonVoteStatusMutation();
  const [
    upsertWordDefinition,
    {
      data: wordDefinitionData,
      error: wordDefinitionError,
      loading: wordDefinitionLoading,
      called: wordDefinitionCalled,
    },
  ] = useWordDefinitionUpsertMutation();

  const [present] = useIonToast();

  const [allDefinitions, setAllDefinitions] =
    useState<WordDefinitionWithVoteListOutput>();
  const [wordWithVote, setWordWithVote] = useState<WordWithVoteOutput>();

  const modal = useRef<HTMLIonModalElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  useIonViewDidEnter(() => {
    console.log('getWordDefinitionsByWordId');
    getWordDefinitionsByWordId({
      variables: {
        word_id: match.params.word_id,
      },
    });
  });

  useIonViewDidEnter(() => {
    console.log('getWordWithVoteById');
    getWordWithVoteById({
      variables: {
        word_id: match.params.word_id,
      },
    });
  });

  useEffect(() => {
    if (definitionError) {
      console.log(definitionError);
      alert('Error');

      return;
    }

    if (definitionLoading || !definitionCalled) {
      return;
    }

    if (definitionData) {
      if (
        definitionData.getWordDefinitionsByWordId.error !== ErrorType.NoError
      ) {
        console.log(definitionData.getWordDefinitionsByWordId.error);
        alert(definitionData.getWordDefinitionsByWordId.error);
        return;
      }

      setAllDefinitions(definitionData.getWordDefinitionsByWordId);
    }
  }, [definitionData, definitionError, definitionLoading, definitionCalled]);

  useEffect(() => {
    if (wordError) {
      console.log(wordError);
      alert('Error');

      return;
    }

    if (wordLoading || !wordCalled) {
      return;
    }

    if (wordData) {
      if (wordData.getWordWithVoteById.error !== ErrorType.NoError) {
        console.log(wordData.getWordWithVoteById.error);
        alert(wordData.getWordWithVoteById.error);
        return;
      }

      setWordWithVote(wordData.getWordWithVoteById);
    }
  }, [wordData, wordError, wordLoading, wordCalled]);

  useEffect(() => {
    if (wordVoteError) {
      console.log(wordVoteError);
      alert('Error');

      return;
    }

    if (wordVoteLoading || !wordVoteCalled) {
      return;
    }

    if (wordVoteData) {
      if (wordVoteData.toggleWordVoteStatus.error !== ErrorType.NoError) {
        console.log(wordVoteData.toggleWordVoteStatus.error);
        alert(wordVoteData.toggleWordVoteStatus.error);
        return;
      }

      const vote_status = wordVoteData.toggleWordVoteStatus.vote_status;

      if (vote_status) {
        setWordWithVote((_wordWithVote) => {
          if (!_wordWithVote || !_wordWithVote.word_with_vote) {
            return _wordWithVote;
          }

          if (_wordWithVote.word_with_vote.word_id === vote_status.word_id) {
            return {
              ..._wordWithVote,
              word_with_vote: {
                ..._wordWithVote.word_with_vote,
                upvotes: vote_status.upvotes,
                downvotes: vote_status.downvotes,
              },
            };
          } else {
            return _wordWithVote;
          }
        });
      }
    }
  }, [wordVoteError, wordVoteLoading, wordVoteCalled, wordVoteData]);

  useEffect(() => {
    if (wordDefinitionError) {
      console.log(wordDefinitionError);
      alert('Error');

      return;
    }

    if (wordDefinitionLoading) {
      return;
    }

    if (wordDefinitionData) {
      if (wordDefinitionData.wordDefinitionUpsert.error !== ErrorType.NoError) {
        console.log(wordDefinitionData.wordDefinitionUpsert.error);
        present({
          message: 'Failed at creating new definition!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      present({
        message: 'Success at creating new definition!',
        duration: 1500,
        position: 'top',
        color: 'success',
      });

      setAllDefinitions((_definitions) => {
        const newDefinition =
          wordDefinitionData.wordDefinitionUpsert.word_definition;

        if (!_definitions || !newDefinition) {
          return _definitions;
        }

        return {
          ..._definitions,
          word_definition_list: [
            ..._definitions.word_definition_list,
            {
              ...newDefinition,
              upvotes: 0,
              downvotes: 0,
              created_at: new Date().toISOString(),
            } as WordDefinitionWithVote,
          ],
        };
      });

      modal.current?.dismiss();
    }
  }, [
    wordDefinitionData,
    wordDefinitionError,
    wordDefinitionLoading,
    wordDefinitionCalled,
    present,
  ]);

  useEffect(() => {
    if (wordDefinitionVoteError) {
      console.log(wordDefinitionVoteError);
      alert('Error');

      return;
    }

    if (wordDefinitionVoteLoading) {
      return;
    }

    if (wordDefinitionVoteData) {
      if (
        wordDefinitionVoteData.toggleWordDefinitonVoteStatus.error !==
        ErrorType.NoError
      ) {
        console.log(wordDefinitionVoteData.toggleWordDefinitonVoteStatus.error);
        present({
          message: 'Failed at voting!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }

      setAllDefinitions((_definitions) => {
        const vote_status =
          wordDefinitionVoteData.toggleWordDefinitonVoteStatus.vote_status;

        if (!_definitions || !vote_status) {
          return _definitions;
        }

        return {
          ..._definitions,
          word_definition_list: [
            ..._definitions.word_definition_list.map((definition) => {
              if (!definition) {
                return definition;
              }

              if (definition.word_definition_id === vote_status.definition_id) {
                return {
                  ...definition,
                  downvotes: vote_status.downvotes,
                  upvotes: vote_status.upvotes,
                };
              }

              return definition;
            }),
          ],
        };
      });
    }
  }, [
    wordDefinitionVoteData,
    wordDefinitionVoteError,
    wordDefinitionVoteLoading,
    present,
  ]);

  const handleSaveNewDefinition = () => {
    const textareaEl = textarea.current;
    if (!textareaEl) {
      present({
        message: 'Input or Textarea not exists!',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const textareaVal = (textareaEl.value + '').trim();

    if (textareaVal.length === 0) {
      present({
        message: 'Definition cannot be empty string!',
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertWordDefinition({
      variables: {
        word_id: match.params.word_id,
        definition: textareaVal,
      },
    });
  };

  const definitions = useMemo(() => {
    const tempDefinitions: {
      word_definition_id: string;
      definition: string;
      word: string;
      upvotes: number;
      downvotes: number;
      created_at: Date;
    }[] = [];

    if (!allDefinitions) {
      return tempDefinitions;
    }

    for (const definition of allDefinitions.word_definition_list) {
      if (definition) {
        tempDefinitions.push({
          word_definition_id: definition.word_definition_id,
          definition: definition.definition,
          word: definition.word.word,
          upvotes: definition.upvotes,
          downvotes: definition.downvotes,
          created_at: new Date(definition.created_at),
        });
      }
    }

    return tempDefinitions;
  }, [allDefinitions]);

  const wordCom =
    !!wordWithVote && !!wordWithVote.word_with_vote ? (
      <Card
        content={wordWithVote.word_with_vote.word}
        vote={{
          upVotes: wordWithVote.word_with_vote.upvotes,
          downVotes: wordWithVote.word_with_vote.downvotes,
          onVoteUpClick: () => {
            toggleWordVoteStatus({
              variables: {
                word_id: wordWithVote!.word_with_vote!.word_id,
                vote: true,
              },
            });
          },
          onVoteDownClick: () => {
            toggleWordVoteStatus({
              variables: {
                word_id: wordWithVote!.word_with_vote!.word_id,
                vote: false,
              },
            });
          },
        }}
        voteFor="content"
      />
    ) : null;

  const definitionsCom = definitions
    ? definitions.map((definition) => (
        <Card
          key={definition.word_definition_id}
          description={definition.definition}
          vote={{
            upVotes: definition.upvotes,
            downVotes: definition.downvotes,
            onVoteUpClick: () => {
              toggleWordDefinitionVoteStatus({
                variables: {
                  word_definition_id: definition.word_definition_id,
                  vote: true,
                },
              });
            },
            onVoteDownClick: () => {
              toggleWordDefinitionVoteStatus({
                variables: {
                  word_definition_id: definition.word_definition_id,
                  vote: false,
                },
              });
            },
          }}
          voteFor="description"
        />
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

            <CardContainer>{wordCom}</CardContainer>

            <hr />

            <p style={{ padding: '0 16px', fontSize: 16 }}>Definitions</p>

            <IonButton id="open-modal" expand="block">
              + Add More Definitions
            </IonButton>

            <CardListContainer>{definitionsCom}</CardListContainer>

            <IonModal ref={modal} trigger="open-modal">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      Cancel
                    </IonButton>
                  </IonButtons>
                  <IonTitle>Dictionary</IonTitle>
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
                  <Textarea
                    ref={textarea}
                    label="Input New Definition"
                    labelPlacement="floating"
                    fill="solid"
                    placeholder="Input New Definition..."
                  />
                  <IonButton onClick={handleSaveNewDefinition}>Save</IonButton>
                </div>
              </IonContent>
            </IonModal>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
