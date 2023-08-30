import { useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonRouter,
} from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetWordDefinitionsByWordIdQuery,
  useGetWordWithVoteByIdQuery,
} from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
  StChatIcon,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useToggleWordVoteStatusMutation } from '../../../hooks/useToggleWordVoteStatusMutation';
import { useToggleWordDefinitionVoteStatusMutation } from '../../../hooks/useToggleWordDefinitionVoteStatusMutation';

import { AddListHeader } from '../../common/ListHeader';
import { VoteButtonsHerizontal } from '../../common/VoteButtonsHerizontal';
import { NewWordDefinitionForm } from '../NewWordDefinitionForm';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';

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

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

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
        });
      }
    }

    return tempDefinitions.map((definition) => (
      <CardContainer key={definition.word_definition_id}>
        <Card
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
          discussion={{
            onChatClick: () =>
              router.push(
                `/${match.params.nation_id}/${match.params.language_id}/1/discussion/word_definitions/${definition.word_definition_id}/Dictionary: ${wordData?.getWordWithVoteById.word_with_vote?.word} - ${definition.definition}`,
              ),
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
    wordData?.getWordWithVoteById.word_with_vote?.word,
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
        <VoteButtonsHerizontal
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
        <StChatIcon
          icon={chatbubbleEllipsesSharp}
          onClick={() =>
            router.push(
              `/${match.params.nation_id}/${match.params.language_id}/1/discussion/words/${wordWithVote.word_id}/Dictionary: ${wordWithVote.word}`,
            )
          }
        />
      </div>
    );
  }, [
    match.params.language_id,
    match.params.nation_id,
    router,
    toggleWordVoteStatus,
    wordData,
    wordError,
  ]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Dictionary')}</Caption>
      </CaptionContainer>

      <CardContainer>{wordCom}</CardContainer>

      <AddListHeader
        title={tr('Definitions')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{definitionsCom}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Word Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {match.params.word_id ? (
            <NewWordDefinitionForm
              word_id={match.params.word_id}
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
