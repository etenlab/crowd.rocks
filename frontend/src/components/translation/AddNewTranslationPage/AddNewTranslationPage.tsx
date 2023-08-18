import { useState, useRef, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  useIonToast,
  IonModal,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';
import { ApolloCache } from '@apollo/client';

import { TextareaCustomEvent } from '@ionic/react/dist/types/components';
import { TextareaChangeEventDetail } from '@ionic/core/dist/types/components/textarea/textarea-interface';

import { Caption } from '../../common/Caption/Caption';

import { WordOrPhraseList } from '../WordOrPhraseList';

import {
  useUpsertTranslationMutation,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation,
  ErrorType,
  Translation,
  TranslationWithVote,
} from '../../../generated/graphql';

import { GetTranslationsByFromDefinitionIdQuery } from '../../../generated/graphql';

import { GetTranslationsByFromDefinitionIdDocument } from '../../../generated/graphql';

import { CaptionContainer, Stack, Button } from './styled';
import { Input, Textarea } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { PageLayout } from '../../common/PageLayout';

interface AddNewTranslationPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    definition_kind: 'word' | 'phrase';
    definition_id: string;
  }> {}

export function AddNewTranslationPage({ match }: AddNewTranslationPageProps) {
  const { tr } = useTr();
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

  const modal = useRef<HTMLIonModalElement>(null);

  const [filter, setFilter] = useState<string>('');
  const [definitionId, setDefinitionId] = useState<number | null>(null);
  const [isWordDefinition, setIsWordDefinition] = useState<boolean | null>(
    null,
  );
  const [wordOrPhrase, setWordOrPhrase] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');

  const updateTranslationList = useCallback(
    (cache: ApolloCache<unknown>, translation: Translation) => {
      if (target) {
        cache.updateQuery<GetTranslationsByFromDefinitionIdQuery>(
          {
            query: GetTranslationsByFromDefinitionIdDocument,
            variables: {
              definition_id: match.params.definition_id,
              from_definition_type_is_word:
                match.params.definition_kind === 'word' ? true : false,
              language_code: target!.lang.tag,
              dialect_code: target!.dialect?.tag,
              geo_code: target!.region?.tag,
            },
          },
          (data) => {
            if (data) {
              const { translation_with_vote_list } =
                data.getTranslationsByFromDefinitionId;

              let newTypeName:
                | 'WordToWordTranslationWithVote'
                | 'WordToPhraseTranslationWithVote'
                | 'PhraseToWordTranslationWithVote'
                | 'PhraseToPhraseTranslationWithVote'
                | undefined;

              switch (translation.__typename) {
                case 'WordToWordTranslation': {
                  newTypeName = 'WordToWordTranslationWithVote';
                  break;
                }
                case 'WordToPhraseTranslation': {
                  newTypeName = 'WordToPhraseTranslationWithVote';
                  break;
                }
                case 'PhraseToWordTranslation': {
                  newTypeName = 'PhraseToWordTranslationWithVote';
                  break;
                }
                case 'PhraseToPhraseTranslation': {
                  newTypeName = 'PhraseToPhraseTranslationWithVote';
                  break;
                }
              }

              if (newTypeName === undefined || !translation_with_vote_list) {
                return data;
              }

              const newTranslationWithVote = {
                ...translation,
                __typename: newTypeName,
                upvotes: 0,
                downvotes: 0,
              } as TranslationWithVote;

              return {
                ...data,
                getTranslationsByFromDefinitionId: {
                  ...data.getTranslationsByFromDefinitionId,
                  translation_with_vote_list: [
                    ...translation_with_vote_list,
                    newTranslationWithVote,
                  ],
                },
              };
            } else {
              return data;
            }
          },
        );
      }
    },
    [match.params.definition_id, match.params.definition_kind, target],
  );

  const [upsertTranslation] = useUpsertTranslationMutation({
    update(cache, { data: newTranslationData, errors }) {
      if (
        errors ||
        !newTranslationData ||
        newTranslationData.upsertTranslation.error !== ErrorType.NoError
      ) {
        console.log('useUpsertTranslationMutation: ', errors);
        console.log(newTranslationData?.upsertTranslation.error);

        present({
          message: `${tr(
            'Failed at creating new translation!',
          )} [${newTranslationData?.upsertTranslation.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      const { translation } = newTranslationData.upsertTranslation;

      if (translation) {
        updateTranslationList(cache, translation);
      }

      present({
        message: tr('Success at creating new translation!'),
        duration: 1500,
        position: 'top',
        color: 'success',
      });
    },
  });
  const [upsertTranslationFromWordAndDefinitionlikeString] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation({
      update(cache, { data: newTranslationData, errors }) {
        if (
          errors ||
          !newTranslationData ||
          newTranslationData.upsertTranslationFromWordAndDefinitionlikeString
            .error !== ErrorType.NoError
        ) {
          console.log(
            'useUpsertTranslationFromWordAndDefinitionlikeStringMutation: ',
            errors,
          );
          console.log(
            newTranslationData?.upsertTranslationFromWordAndDefinitionlikeString
              .error,
          );

          present({
            message: `${tr(
              'Failed at creating new translation!',
            )} [${newTranslationData
              ?.upsertTranslationFromWordAndDefinitionlikeString.error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });

          return;
        }

        const { translation } =
          newTranslationData.upsertTranslationFromWordAndDefinitionlikeString;

        if (translation) {
          updateTranslationList(cache, translation);
        }

        present({
          message: tr('Success at creating new translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      },
    });

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleWordOrPhraseChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setWordOrPhrase(event.detail.value!);
    setDefinitionId(null);
    setIsWordDefinition(null);
  };

  const handleDefinitionChange = (
    event: TextareaCustomEvent<TextareaChangeEventDetail>,
  ) => {
    setDefinition(event.target.value!);
    setDefinitionId(null);
    setIsWordDefinition(null);
  };

  const handleClickDefinition = (
    definitionId: number,
    is_word_definition: boolean,
    more?: {
      wordOrPhrase: string;
      definition: string;
    },
  ) => {
    if (more) {
      setWordOrPhrase(more.wordOrPhrase);
      setDefinition(more.definition);
    }
    setDefinitionId(definitionId);
    setIsWordDefinition(is_word_definition);

    modal.current?.dismiss();
  };

  const handleSaveNewTranslation = () => {
    if (definitionId && isWordDefinition !== null) {
      upsertTranslation({
        variables: {
          from_definition_id: match.params.definition_id,
          from_definition_type_is_word:
            match.params.definition_kind === 'word' ? true : false,
          to_definition_id: definitionId + '',
          to_definition_type_is_word: isWordDefinition,
        },
      });

      return;
    }

    if (
      wordOrPhrase.trim().length > 0 &&
      definition.trim().length > 0 &&
      target
    ) {
      upsertTranslationFromWordAndDefinitionlikeString({
        variables: {
          from_definition_id: match.params.definition_id,
          from_definition_type_is_word:
            match.params.definition_kind === 'word' ? true : false,
          word_or_phrase: wordOrPhrase,
          definition: definition.trim(),
          is_type_word:
            wordOrPhrase.trim().split(' ').length === 1 ? true : false,
          language_code: target.lang.tag,
          dialect_code: target.dialect?.tag,
          geo_code: target.region?.tag,
        },
      });
    } else {
      present({
        message: `${tr('Invalid Input'!)}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  };

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('New Translation')}</Caption>
      </CaptionContainer>

      <Stack>
        <Button
          id="open-translation-definition-list-modal"
          expand="block"
          fill="outline"
        >
          + {tr('Select From Definition List')}
        </Button>

        <Input
          type="text"
          label={tr('Input New Word or Phrase')}
          labelPlacement="floating"
          fill="outline"
          value={wordOrPhrase}
          onIonInput={handleWordOrPhraseChange}
        />
        <Textarea
          labelPlacement="floating"
          fill="solid"
          label={tr('Input New Definition')}
          value={definition}
          onIonInput={handleDefinitionChange}
        />

        <Button onClick={handleSaveNewTranslation} expand="block">
          {tr('Save')}
        </Button>
      </Stack>

      <IonModal ref={modal} trigger="open-translation-definition-list-modal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>
                {tr('Cancel')}
              </IonButton>
            </IonButtons>
            <IonTitle>{tr('Dictionary')}</IonTitle>
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
            <Stack>
              <Input
                type="text"
                label={tr('Search')}
                labelPlacement="floating"
                fill="outline"
                debounce={300}
                value={filter}
                onIonInput={handleFilterChange}
              />

              <WordOrPhraseList
                filter={filter}
                langInfo={target}
                onClickDefinition={handleClickDefinition}
              />
            </Stack>
          </div>
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
