import { useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  // useIonToast,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetPhraseDefinitionsByPhraseIdQuery,
  useGetPhraseWithVoteByIdQuery,
} from '../../../generated/graphql';

import { ErrorType, Phrase } from '../../../generated/graphql';

import { useTogglePhraseDefinitonVoteStatusMutation } from '../../../hooks/useTogglePhraseDefinitionVoteStatusMutation';

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useTogglePhraseVoteStatusMutation } from '../../../hooks/useTogglePhraseVoteStatusMutation';

import { AddListHeader } from '../../common/ListHeader';
import { VoteButtonsHerizontal } from '../../common/VoteButtonsHerizontal';
import { PageLayout } from '../../common/PageLayout';

import { NewPhraseDefinitionForm } from '../NewPhraseDefinitionForm';

interface PhraseDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    phrase_id: string;
  }> {}

export function PhraseDetailPage({ match }: PhraseDetailPageProps) {
  // const [present] = useIonToast();
  const { tr } = useTr();

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
        });
      }
    }

    return tempDefinitions.map((definition) => (
      <CardContainer key={definition.phrase_definition_id}>
        <Card
          description={definition.definition}
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
        />
      </CardContainer>
    ));
  }, [definitionData, definitionError, togglePhraseDefinitionVoteStatus]);

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
        <VoteButtonsHerizontal
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
      </div>
    );
  }, [phraseData, phraseError, togglePhraseVoteStatus]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Phrase Book')}</Caption>
      </CaptionContainer>

      <CardContainer>{phraseCom}</CardContainer>

      <AddListHeader
        title={tr('Definitions')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{definitionsCom}</CardListContainer>

      <IonModal isOpen={isOpenModal}>
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
