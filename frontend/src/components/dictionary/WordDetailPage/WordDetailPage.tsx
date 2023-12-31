import { useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonRouter,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';
import { Flag } from '../../flags/Flag';

import {
  useGetWordDefinitionsByWordIdQuery,
  useGetWordWithVoteByIdQuery,
} from '../../../generated/graphql';

import { ErrorType, TableNameType } from '../../../generated/graphql';

import { CardListContainer, CardContainer } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useToggleWordVoteStatusMutation } from '../../../hooks/useToggleWordVoteStatusMutation';
import { useToggleWordDefinitionVoteStatusMutation } from '../../../hooks/useToggleWordDefinitionVoteStatusMutation';

import { AddListHeader } from '../../common/ListHeader';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { NewWordDefinitionForm } from '../NewWordDefinitionForm';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';
import { Chat } from '../../chat/Chat';
import { useAppContext } from '../../../hooks/useAppContext';

interface WordDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    word_id: string;
  }> {}

export function WordDetailPage({ match }: WordDetailPageProps) {
  const { tr } = useTr();
  const router = useIonRouter();
  // const [present] = useIonToast();

  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const { data: definitionData, error: definitionError } =
    useGetWordDefinitionsByWordIdQuery({
      variables: {
        word_id: match.params.word_id,
      },
    });
  const { data: wordData, error: wordError } = useGetWordWithVoteByIdQuery({
    variables: {
      word_id: match.params.word_id,
    },
  });

  const [toggleWordVoteStatus] = useToggleWordVoteStatusMutation();
  const [toggleWordDefinitionVoteStatus] =
    useToggleWordDefinitionVoteStatusMutation();

  const definitionsCom = useMemo(() => {
    const tempDefinitions: {
      word_definition_id: string;
      definition: string;
      word: string;
      upvotes: number;
      downvotes: number;
      created_at: Date;
      username: string;
      isBot: boolean;
    }[] = [];

    if (definitionError) {
      return null;
    }

    if (
      !definitionData ||
      definitionData.getWordDefinitionsByWordId.error !== ErrorType.NoError
    ) {
      return null;
    }

    const allDefinitions =
      definitionData.getWordDefinitionsByWordId.word_definition_list;

    for (const definition of allDefinitions) {
      if (definition) {
        tempDefinitions.push({
          word_definition_id: definition.word_definition_id,
          definition: definition.definition,
          word: definition.word.word,
          upvotes: definition.upvotes,
          downvotes: definition.downvotes,
          created_at: new Date(definition.created_at),
          username: definition.created_by_user.avatar,
          isBot: definition.created_by_user.is_bot,
        });
      }
    }

    return tempDefinitions.map((definition) => (
      <CardContainer key={definition.word_definition_id}>
        <Card
          description={definition.definition}
          createdBy={{
            username: definition.username,
            isBot: definition.isBot,
            createdAt:
              definition.created_at && definition.created_at.toDateString(),
          }}
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
          discussion={{
            onChatClick: () =>
              router.push(
                `/${match.params.nation_id}/${match.params.language_id}/1/discussion/word_definitions/${definition.word_definition_id}`,
              ),
            parent_id: definition.word_definition_id,
            parent_table: 'word_definitions',
          }}
          flags={{
            parent_table: TableNameType.WordDefinitions,
            parent_id: definition.word_definition_id,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
          voteFor="description"
        />
      </CardContainer>
    ));
  }, [
    definitionData,
    definitionError,
    match.params.language_id,
    match.params.nation_id,
    router,
    toggleWordDefinitionVoteStatus,
  ]);

  const wordCom = useMemo(() => {
    if (wordError) {
      return null;
    }

    if (!wordData || wordData.getWordWithVoteById.error !== ErrorType.NoError) {
      return null;
    }

    const wordWithVote = wordData.getWordWithVoteById.word_with_vote;

    if (!wordWithVote) {
      return null;
    }
    return (
      <div style={{ display: 'flex' }}>
        <IonTitle>Word: {wordWithVote.word}</IonTitle>
        <VoteButtonsHorizontal
          upVotes={wordWithVote.upvotes}
          downVotes={wordWithVote.downvotes}
          onVoteUpClick={() => {
            toggleWordVoteStatus({
              variables: {
                word_id: wordWithVote.word_id,
                vote: true,
              },
            });
          }}
          onVoteDownClick={() => {
            toggleWordVoteStatus({
              variables: {
                word_id: wordWithVote.word_id,
                vote: false,
              },
            });
          }}
        />
        <Flag
          parent_table={TableNameType.Words}
          parent_id={wordWithVote.word_id}
          flag_names={WORD_AND_PHRASE_FLAGS}
        />
        <div style={{ display: 'flex' }}>
          <Chat
            parent_id={match.params.word_id}
            parent_table="words"
            onClick={() =>
              router.push(
                `/${match.params.nation_id}/${match.params.language_id}/1/discussion/words/${wordWithVote.word_id}`,
              )
            }
          />
        </div>
      </div>
    );
  }, [
    match.params.language_id,
    match.params.nation_id,
    match.params.word_id,
    router,
    toggleWordVoteStatus,
    wordData,
    wordError,
  ]);

  const handleOpenModal = () => {
    openModal(
      <>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Word Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {match.params.word_id ? (
            <NewWordDefinitionForm
              word_id={match.params.word_id}
              onCreated={closeModal}
              onCancel={closeModal}
            />
          ) : null}
        </IonContent>
      </>,
      'full',
    );
  };

  return (
    <PageLayout>
      <Caption>{tr('Dictionary')}</Caption>

      <CardContainer>{wordCom}</CardContainer>

      <AddListHeader
        title={tr('Definitions')}
        onClick={() => handleOpenModal()}
      />

      <CardListContainer>{definitionsCom}</CardListContainer>
    </PageLayout>
  );
}
