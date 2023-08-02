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
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetWordDefinitionsByWordIdQuery,
  useGetWordWithVoteByIdQuery,
  useToggleWordVoteStatusMutation,
  useWordDefinitionUpsertMutation,
  useToggleWordDefinitonVoteStatusMutation,
} from '../../../generated/graphql';

import {
  WordDefinitionWithVoteListOutput,
  WordWithDefinitionlikeStrings,
  WordDefinitionWithVote,
  WordWithVoteOutput,
  WordWithVote,
  ErrorType,
} from '../../../generated/graphql';

import {
  WordWithVoteFragmentFragmentDoc,
  GetWordDefinitionsByWordIdDocument,
  WordDefinitionWithVoteFragmentFragmentDoc,
  WordWithDefinitionlikeStringsFragmentFragmentDoc,
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
  const [present] = useIonToast();

  const [allDefinitions, setAllDefinitions] =
    useState<WordDefinitionWithVoteListOutput>();
  const [wordWithVote, setWordWithVote] = useState<WordWithVoteOutput>();

  const modal = useRef<HTMLIonModalElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const {
    data: definitionData,
    error: definitionError,
    loading: definitionLoading,
    called: definitionCalled,
  } = useGetWordDefinitionsByWordIdQuery({
    variables: {
      word_id: match.params.word_id,
    },
  });
  const {
    data: wordData,
    error: wordError,
    loading: wordLoading,
    called: wordCalled,
  } = useGetWordWithVoteByIdQuery({
    variables: {
      word_id: match.params.word_id,
    },
  });

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

      if (!wordData || !data || !data.toggleWordVoteStatus.vote_status) {
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
  const [toggleWordDefinitionVoteStatus] =
    useToggleWordDefinitonVoteStatusMutation({
      update(cache, { data, errors }) {
        if (errors) {
          console.log('useToggleWordDefinitonVoteStatusMutation: ', errors);

          present({
            message: 'Failed at voting!',
            duration: 1500,
            position: 'top',
            color: 'danger',
          });

          return;
        }

        if (
          !definitionData ||
          !data ||
          !data.toggleWordDefinitonVoteStatus.vote_status
        ) {
          return;
        }

        const newVoteStatus = data.toggleWordDefinitonVoteStatus.vote_status;

        cache.updateFragment<WordDefinitionWithVote>(
          {
            id: cache.identify({
              __typename: 'WordDefinitionWithVote',
              word_definition_id: newVoteStatus.definition_id,
            }),
            fragment: WordDefinitionWithVoteFragmentFragmentDoc,
            fragmentName: 'WordDefinitionWithVoteFragment',
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
  const [upsertWordDefinition] = useWordDefinitionUpsertMutation({
    update(cache, { data, errors }) {
      if (errors) {
        console.log('useWordDefinitionUpsertMutation: ', errors);

        present({
          message: 'Failed at creating new definition!',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (!definitionData || !data) {
        return;
      }

      const newDefinition = data.wordDefinitionUpsert.word_definition;

      cache.writeQuery({
        query: GetWordDefinitionsByWordIdDocument,
        data: {
          ...definitionData,
          getWordDefinitionsByWordId: {
            ...definitionData.getWordDefinitionsByWordId,
            word_definition_list: [
              ...definitionData.getWordDefinitionsByWordId.word_definition_list,
              {
                ...newDefinition,
                __typename: 'WordDefinitionWithVote',
                upvotes: 0,
                downvotes: 0,
                created_at: new Date().toISOString(),
              },
            ],
          },
        },
        variables: {
          word_id: match.params.word_id,
        },
      });

      present({
        message: 'Success at creating new definition!',
        duration: 1500,
        position: 'top',
        color: 'success',
      });

      modal.current?.dismiss();
    },
  });

  useEffect(() => {
    if (definitionError) {
      return;
    }

    if (definitionLoading || !definitionCalled) {
      return;
    }

    if (definitionData) {
      if (
        definitionData.getWordDefinitionsByWordId.error !== ErrorType.NoError
      ) {
        return;
      }

      setAllDefinitions(definitionData.getWordDefinitionsByWordId);
    }
  }, [definitionData, definitionError, definitionLoading, definitionCalled]);

  useEffect(() => {
    if (wordError) {
      return;
    }

    if (wordLoading || !wordCalled) {
      return;
    }

    if (wordData) {
      if (wordData.getWordWithVoteById.error !== ErrorType.NoError) {
        return;
      }

      setWordWithVote(wordData.getWordWithVoteById);
    }
  }, [wordData, wordError, wordLoading, wordCalled]);

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
