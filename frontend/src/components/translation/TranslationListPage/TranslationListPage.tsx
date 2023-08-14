import { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, useIonToast, useIonRouter } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  ErrorType,
  usePhraseDefinitionReadLazyQuery,
  useWordDefinitionReadLazyQuery,
  useGetTranslationsByFromDefinitionIdLazyQuery,
  useToggleTranslationVoteStatusMutation,
} from '../../../generated/graphql';

import {
  WordDefinition,
  PhraseDefinition,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
} from '../../../generated/graphql';

import {
  WordToWordTranslationWithVoteFragmentFragmentDoc,
  WordToPhraseTranslationWithVoteFragmentFragmentDoc,
  PhraseToWordTranslationWithVoteFragmentFragmentDoc,
  PhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  CardListContainer,
  CardContainer,
  Button,
  Stack,
} from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

interface TranslationListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    definition_kind: 'word' | 'phrase';
    definition_id: string;
  }> {}

export function TranslationListPage({ match }: TranslationListPageProps) {
  const { tr } = useTr();
  const router = useIonRouter();
  const [present] = useIonToast();

  const {
    states: {
      global: {
        langauges: {
          translationPage: { target },
        },
      },
    },
  } = useAppContext();

  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(
    null,
  );
  const [phraseDefinition, setPhraseDefinition] =
    useState<PhraseDefinition | null>(null);
  const [wordToWordTranslationList, setWordToWordTranslationList] = useState<
    WordToWordTranslationWithVote[]
  >([]);
  const [wordToPhraseTranslationList, setWordToPhraseTranslationList] =
    useState<WordToPhraseTranslationWithVote[]>([]);
  const [phraseToWordTranslationList, setPhraseToWordTranslationList] =
    useState<PhraseToWordTranslationWithVote[]>([]);
  const [phraseToPhraseTranslationList, setPhraseToPhraseTranslationList] =
    useState<PhraseToPhraseTranslationWithVote[]>([]);

  const [
    phraseDefinitionRead,
    {
      data: phraseDefinitionData,
      error: phraseDefinitionError,
      loading: phraseDefinitionLoading,
    },
  ] = usePhraseDefinitionReadLazyQuery();
  const [
    wordDefinitionRead,
    {
      data: wordDefinitionData,
      error: wordDefinitionError,
      loading: wordDefinitionLoading,
    },
  ] = useWordDefinitionReadLazyQuery();

  const [
    getTranslationsByFromDefinitionId,
    {
      data: translationData,
      error: translationError,
      loading: translationLoading,
    },
  ] = useGetTranslationsByFromDefinitionIdLazyQuery();

  const [toggleTranslationVoteStatus] = useToggleTranslationVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        errors ||
        !data ||
        data.toggleTranslationVoteStatus.error !== ErrorType.NoError ||
        !translationData ||
        translationData.getTranslationsByFromDefinitionId.error !==
          ErrorType.NoError ||
        !target
      ) {
        console.log('useToggleTranslationVoteStatusMutation: ', errors);
        console.log(data?.toggleTranslationVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleTranslationVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (data.toggleTranslationVoteStatus.word_to_word_vote_status) {
        const newVoteStatus =
          data.toggleTranslationVoteStatus.word_to_word_vote_status;

        cache.updateFragment<WordToWordTranslationWithVote>(
          {
            id: cache.identify({
              __typename: 'WordToWordTranslationWithVote',
              word_to_word_translation_id:
                newVoteStatus.word_to_word_translation_id,
            }),
            fragment: WordToWordTranslationWithVoteFragmentFragmentDoc,
            fragmentName: 'WordToWordTranslationWithVoteFragment',
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
      }

      if (data.toggleTranslationVoteStatus.word_to_phrase_vote_status) {
        const newVoteStatus =
          data.toggleTranslationVoteStatus.word_to_phrase_vote_status;

        cache.updateFragment<WordToPhraseTranslationWithVote>(
          {
            id: cache.identify({
              __typename: 'WordToPhraseTranslationWithVote',
              word_to_phrase_translation_id:
                newVoteStatus.word_to_phrase_translation_id,
            }),
            fragment: WordToPhraseTranslationWithVoteFragmentFragmentDoc,
            fragmentName: 'WordToPhraseTranslationWithVoteFragment',
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
      }

      if (data.toggleTranslationVoteStatus.phrase_to_word_vote_status) {
        const newVoteStatus =
          data.toggleTranslationVoteStatus.phrase_to_word_vote_status;

        cache.updateFragment<PhraseToWordTranslationWithVote>(
          {
            id: cache.identify({
              __typename: 'PhraseToWordTranslationWithVote',
              phrase_to_word_translation_id:
                newVoteStatus.phrase_to_word_translation_id,
            }),
            fragment: PhraseToWordTranslationWithVoteFragmentFragmentDoc,
            fragmentName: 'PhraseToWordTranslationWithVoteFragment',
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
      }

      if (data.toggleTranslationVoteStatus.phrase_to_phrase_vote_status) {
        const newVoteStatus =
          data.toggleTranslationVoteStatus.phrase_to_phrase_vote_status;

        cache.updateFragment<PhraseToPhraseTranslationWithVote>(
          {
            id: cache.identify({
              __typename: 'PhraseToPhraseTranslationWithVote',
              phrase_to_phrase_translation_id:
                newVoteStatus.phrase_to_phrase_translation_id,
            }),
            fragment: PhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
            fragmentName: 'PhraseToPhraseTranslationWithVoteFragment',
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
      }
    },
  });

  useEffect(() => {
    if (target) {
      getTranslationsByFromDefinitionId({
        variables: {
          definition_id: match.params.definition_id,
          from_definition_type_is_word:
            match.params.definition_kind === 'word' ? true : false,
          language_code: target!.lang.tag,
          dialect_code: target!.dialect?.tag,
          geo_code: target!.region?.tag,
        },
      });
    }
  }, [
    target,
    getTranslationsByFromDefinitionId,
    match.params.definition_id,
    match.params.definition_kind,
  ]);

  useEffect(() => {
    if (match.params.definition_kind === 'word') {
      wordDefinitionRead({
        variables: {
          id: match.params.definition_id,
        },
      });
    } else {
      phraseDefinitionRead({
        variables: {
          id: match.params.definition_id,
        },
      });
    }
  }, [
    match.params.definition_kind,
    match.params.definition_id,
    wordDefinitionRead,
    phraseDefinitionRead,
  ]);

  useEffect(() => {
    if (wordDefinitionLoading) {
      return;
    }

    if (wordDefinitionError) {
      present({
        message: `${tr(
          'Faild at reading WordDefinition!',
        )} [${wordDefinitionError}]`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (wordDefinitionData?.wordDefinitionRead) {
      if (wordDefinitionData.wordDefinitionRead.error !== ErrorType.NoError) {
        present({
          message: `${tr('Faild at reading WordDefinition!')} [${
            wordDefinitionData.wordDefinitionRead.error
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (wordDefinitionData.wordDefinitionRead.word_definition) {
        setWordDefinition(
          wordDefinitionData?.wordDefinitionRead.word_definition,
        );

        setPhraseDefinition(null);
      }
    }
  }, [
    tr,
    present,
    wordDefinitionData,
    wordDefinitionError,
    wordDefinitionLoading,
  ]);

  useEffect(() => {
    if (phraseDefinitionLoading) {
      return;
    }

    if (phraseDefinitionError) {
      present({
        message: `${tr(
          'Faild at reading WordDefinition!',
        )} [${phraseDefinitionError}]`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (phraseDefinitionData?.phraseDefinitionRead) {
      if (
        phraseDefinitionData.phraseDefinitionRead.error !== ErrorType.NoError
      ) {
        present({
          message: `${tr('Faild at reading PhraseDefinition!')} [${
            phraseDefinitionData.phraseDefinitionRead.error
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (phraseDefinitionData.phraseDefinitionRead.phrase_definition) {
        setPhraseDefinition(
          phraseDefinitionData?.phraseDefinitionRead.phrase_definition,
        );
        setWordDefinition(null);
      }
    }
  }, [
    tr,
    present,
    phraseDefinitionError,
    phraseDefinitionLoading,
    phraseDefinitionData,
  ]);

  useEffect(() => {
    if (translationLoading) {
      return;
    }

    if (translationError) {
      present({
        message: `${tr(
          'Faild at reading WordDefinition!',
        )} [${translationError}]`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }

    if (translationData?.getTranslationsByFromDefinitionId) {
      if (
        translationData.getTranslationsByFromDefinitionId.error !==
        ErrorType.NoError
      ) {
        present({
          message: `${tr('Faild at reading Translations!')} [${
            translationData.getTranslationsByFromDefinitionId.error
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (
        translationData.getTranslationsByFromDefinitionId
          .word_to_word_tr_with_vote_list
      ) {
        setWordToWordTranslationList(
          translationData?.getTranslationsByFromDefinitionId.word_to_word_tr_with_vote_list.filter(
            (w2w) => w2w !== null,
          ) as WordToWordTranslationWithVote[],
        );
      }

      if (
        translationData.getTranslationsByFromDefinitionId
          .word_to_phrase_tr_with_vote_list
      ) {
        setWordToPhraseTranslationList(
          translationData?.getTranslationsByFromDefinitionId.word_to_phrase_tr_with_vote_list.filter(
            (w2p) => w2p !== null,
          ) as WordToPhraseTranslationWithVote[],
        );
      }

      if (
        translationData.getTranslationsByFromDefinitionId
          .phrase_to_word_tr_with_vote_list
      ) {
        setPhraseToWordTranslationList(
          translationData?.getTranslationsByFromDefinitionId.phrase_to_word_tr_with_vote_list.filter(
            (p2w) => p2w !== null,
          ) as PhraseToWordTranslationWithVote[],
        );
      }

      if (
        translationData.getTranslationsByFromDefinitionId
          .phrase_to_phrase_tr_with_vote_list
      ) {
        setPhraseToPhraseTranslationList(
          translationData?.getTranslationsByFromDefinitionId.phrase_to_phrase_tr_with_vote_list.filter(
            (p2p) => p2p !== null,
          ) as PhraseToPhraseTranslationWithVote[],
        );
      }
    }
  }, [present, tr, translationData, translationError, translationLoading]);

  const handleGoToAddNewTranslationPage = () => {
    router.push(
      `/${match.params.nation_id}/${match.params.language_id}/1/add-new-translation/${match.params.definition_kind}/${match.params.definition_id}`,
    );
  };

  let wordOrPhraseCom = wordDefinition ? (
    <Card
      content={wordDefinition.word.word}
      description={wordDefinition.definition}
    />
  ) : null;

  wordOrPhraseCom = phraseDefinition ? (
    <Card
      content={phraseDefinition.phrase.phrase}
      description={phraseDefinition.definition}
    />
  ) : (
    wordOrPhraseCom
  );

  const translationComList = useMemo(() => {
    const temp: {
      key: string;
      translation_id: string;
      wordOrPhrase: string;
      definition: string;
      to_definition_type_is_word: boolean;
      upvotes: number;
      downvotes: number;
    }[] = [];

    for (const wordToWordTr of wordToWordTranslationList) {
      temp.push({
        key: `word_to_word_${wordToWordTr.word_to_word_translation_id}`,
        translation_id: wordToWordTr.word_to_word_translation_id,
        wordOrPhrase: wordToWordTr.to_word_definition.word.word,
        definition: wordToWordTr.to_word_definition.definition,
        to_definition_type_is_word: true,
        upvotes: wordToWordTr.upvotes,
        downvotes: wordToWordTr.downvotes,
      });
    }

    for (const wordToPhraseTr of wordToPhraseTranslationList) {
      temp.push({
        key: `word_to_phrase_${wordToPhraseTr.word_to_phrase_translation_id}`,
        translation_id: wordToPhraseTr.word_to_phrase_translation_id,
        wordOrPhrase: wordToPhraseTr.to_phrase_definition.phrase.phrase,
        definition: wordToPhraseTr.to_phrase_definition.definition,
        to_definition_type_is_word: false,
        upvotes: wordToPhraseTr.upvotes,
        downvotes: wordToPhraseTr.downvotes,
      });
    }

    for (const phraseToWordTr of phraseToWordTranslationList) {
      temp.push({
        key: `phrase_to_word_${phraseToWordTr.phrase_to_word_translation_id}`,
        translation_id: phraseToWordTr.phrase_to_word_translation_id,
        wordOrPhrase: phraseToWordTr.to_word_definition.word.word,
        definition: phraseToWordTr.to_word_definition.definition,
        to_definition_type_is_word: true,
        upvotes: phraseToWordTr.upvotes,
        downvotes: phraseToWordTr.downvotes,
      });
    }

    for (const phraseToPhraseTr of phraseToPhraseTranslationList) {
      temp.push({
        key: `phrase_to_phrase_${phraseToPhraseTr.phrase_to_phrase_translation_id}`,
        translation_id: phraseToPhraseTr.phrase_to_phrase_translation_id,
        wordOrPhrase: phraseToPhraseTr.to_phrase_definition.phrase.phrase,
        definition: phraseToPhraseTr.to_phrase_definition.definition,
        to_definition_type_is_word: false,
        upvotes: phraseToPhraseTr.upvotes,
        downvotes: phraseToPhraseTr.downvotes,
      });
    }

    return temp.map((item) => (
      <CardContainer key={item.key}>
        <Card
          content={item.wordOrPhrase}
          description={item.definition}
          vote={{
            upVotes: item.upvotes,
            downVotes: item.downvotes,
            onVoteUpClick: () => {
              toggleTranslationVoteStatus({
                variables: {
                  translation_id: item.translation_id,
                  vote: true,
                  from_definition_type_is_word:
                    match.params.definition_kind === 'word' ? true : false,
                  to_definition_type_is_word: item.to_definition_type_is_word,
                },
              });
            },
            onVoteDownClick: () => {
              toggleTranslationVoteStatus({
                variables: {
                  translation_id: item.translation_id,
                  vote: false,
                  from_definition_type_is_word:
                    match.params.definition_kind === 'word' ? true : false,
                  to_definition_type_is_word: item.to_definition_type_is_word,
                },
              });
            },
          }}
          voteFor="description"
        />
      </CardContainer>
    ));
  }, [
    match.params.definition_kind,
    phraseToPhraseTranslationList,
    phraseToWordTranslationList,
    toggleTranslationVoteStatus,
    wordToPhraseTranslationList,
    wordToWordTranslationList,
  ]);

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <CaptainContainer>
              <Caption>{tr('Translation')}</Caption>
            </CaptainContainer>
            <Stack>
              {wordOrPhraseCom}

              <Button
                onClick={handleGoToAddNewTranslationPage}
                expand="block"
                fill="outline"
              >
                + {tr('Add New Translation')}
              </Button>

              <p style={{ fontSize: 16 }}>{tr('Translations')}</p>

              <CardListContainer>
                {translationComList.length > 0
                  ? translationComList
                  : tr(`No translations`)}
              </CardListContainer>
            </Stack>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
