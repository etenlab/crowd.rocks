import { useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonRouter,
  // useIonToast,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';
import { Flag } from '../../flags/Flag';

import {
  useGetPhraseDefinitionsByPhraseIdQuery,
  useGetPhraseWithVoteByIdQuery,
} from '../../../generated/graphql';

import { ErrorType, Phrase, TableNameType } from '../../../generated/graphql';

import { useTogglePhraseDefinitonVoteStatusMutation } from '../../../hooks/useTogglePhraseDefinitionVoteStatusMutation';

import {
  CardListContainer,
  CardContainer,
  StChatIcon,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useTogglePhraseVoteStatusMutation } from '../../../hooks/useTogglePhraseVoteStatusMutation';

import { AddListHeader } from '../../common/ListHeader';
import { VoteButtonsHorizontal } from '../../common/VoteButtonsHorizontal';
import { PageLayout } from '../../common/PageLayout';

import { NewPhraseDefinitionForm } from '../NewPhraseDefinitionForm';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

interface PhraseDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    phrase_id: string;
  }> {}

export function PhraseDetailPage({ match }: PhraseDetailPageProps) {
  // const [present] = useIonToast();
  const { tr } = useTr();
  const router = useIonRouter();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { data: definitionData, error: definitionError } =
    useGetPhraseDefinitionsByPhraseIdQuery({
      variables: {
        phrase_id: match.params.phrase_id,
      },
    });
  const { data: phraseData, error: phraseError } =
    useGetPhraseWithVoteByIdQuery({
      variables: {
        phrase_id: match.params.phrase_id,
      },
    });

  const [togglePhraseVoteStatus] = useTogglePhraseVoteStatusMutation();

  const [togglePhraseDefinitionVoteStatus] =
    useTogglePhraseDefinitonVoteStatusMutation();

  const definitionsCom = useMemo(() => {
    const tempDefinitions: {
      phrase_definition_id: string;
      definition: string;
      phrase: Phrase;
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
      definitionData.getPhraseDefinitionsByPhraseId.error !== ErrorType.NoError
    ) {
      return null;
    }

    const allDefinitions =
      definitionData.getPhraseDefinitionsByPhraseId.phrase_definition_list;

    for (const definition of allDefinitions) {
      if (definition) {
        tempDefinitions.push({
          phrase_definition_id: definition.phrase_definition_id,
          definition: definition.definition,
          phrase: definition.phrase,
          upvotes: definition.upvotes,
          downvotes: definition.downvotes,
          created_at: new Date(definition.created_at),
          username: definition.created_by_user.avatar,
          isBot: definition.created_by_user.is_bot,
        });
      }
    }

    return tempDefinitions.map((definition) => (
      <CardContainer key={definition.phrase_definition_id}>
        <Card
          description={definition.definition}
          createdBy={{
            username: definition.username,
            createdAt: new Date(definition.created_at).toDateString(),
            isBot: definition.isBot,
          }}
          vote={{
            upVotes: definition.upvotes,
            downVotes: definition.downvotes,
            onVoteUpClick: () => {
              togglePhraseDefinitionVoteStatus({
                variables: {
                  phrase_definition_id: definition.phrase_definition_id,
                  vote: true,
                },
              });
            },
            onVoteDownClick: () => {
              togglePhraseDefinitionVoteStatus({
                variables: {
                  phrase_definition_id: definition.phrase_definition_id,
                  vote: false,
                },
              });
            },
          }}
          voteFor="description"
          discussion={{
            parent_id: definition.phrase_definition_id,
            parent_table: 'phrase_definitions',
            onChatClick: () =>
              router.push(
                // TODO: maybe can extract the sender from the router in discussion page
                `/${match.params.nation_id}/${match.params.language_id}/1/discussion/phrase_definitions/${definition.phrase_definition_id}`,
              ),
          }}
          flags={{
            parent_table: TableNameType.PhraseDefinitions,
            parent_id: definition.phrase_definition_id,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
        />
      </CardContainer>
    ));
  }, [
    definitionData,
    definitionError,
    match.params.language_id,
    match.params.nation_id,
    router,
    togglePhraseDefinitionVoteStatus,
  ]);

  const phraseCom = useMemo(() => {
    if (phraseError) {
      return null;
    }

    if (
      !phraseData ||
      phraseData.getPhraseWithVoteById.error !== ErrorType.NoError
    ) {
      return null;
    }

    const phraseWithVote = phraseData.getPhraseWithVoteById.phrase_with_vote;

    if (!phraseWithVote) {
      return null;
    }

    return (
      <div style={{ display: 'flex' }}>
        <IonTitle>Phrase: {phraseWithVote.phrase}</IonTitle>
        <VoteButtonsHorizontal
          upVotes={phraseWithVote.upvotes}
          downVotes={phraseWithVote.downvotes}
          onVoteUpClick={() =>
            togglePhraseVoteStatus({
              variables: {
                phrase_id: phraseWithVote.phrase_id,
                vote: true,
              },
            })
          }
          onVoteDownClick={() =>
            togglePhraseVoteStatus({
              variables: {
                phrase_id: phraseWithVote.phrase_id,
                vote: false,
              },
            })
          }
        />
        <Flag
          parent_table={TableNameType.Phrases}
          parent_id={phraseWithVote.phrase_id}
          flag_names={WORD_AND_PHRASE_FLAGS}
        />
        <StChatIcon
          icon={chatbubbleEllipsesSharp}
          onClick={() =>
            router.push(
              `/${match.params.nation_id}/${match.params.language_id}/1/discussion/phrases/${phraseWithVote.phrase_id}`,
            )
          }
        />
      </div>
    );
  }, [
    match.params.language_id,
    match.params.nation_id,
    phraseData,
    phraseError,
    router,
    togglePhraseVoteStatus,
  ]);

  return (
    <PageLayout>
      <Caption>{tr('Phrase Book')}</Caption>

      <CardContainer>{phraseCom}</CardContainer>

      <AddListHeader
        title={tr('Definitions')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{definitionsCom}</CardListContainer>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Phrase Definition')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {match.params.phrase_id ? (
            <NewPhraseDefinitionForm
              phrase_id={match.params.phrase_id}
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
