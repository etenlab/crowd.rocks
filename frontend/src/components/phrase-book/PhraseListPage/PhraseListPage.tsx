import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonModal,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  useIonRouter,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';
import { IonContent, IonPage, useIonToast } from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';
import { Input, Textarea } from '../../common/styled';

import {
  useGetPhrasesByLanguageLazyQuery,
  useTogglePhraseVoteStatusMutation,
  usePhraseUpsertMutation,
} from '../../../generated/graphql';

import {
  PhraseWithVoteListOutput,
  PhraseWithDefinitions,
  PhraseWithVote,
  ErrorType,
} from '../../../generated/graphql';

import {
  PhraseWithDefinitionsFragmentFragmentDoc,
  PhraseWithVoteFragmentFragmentDoc,
  GetPhrasesByLanguageDocument,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  FilterContainer,
  CardListContainer,
  CardContainer,
} from './styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

interface PhraseListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function PhraseListPage({ match }: PhraseListPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();
  const [present] = useIonToast();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const modal = useRef<HTMLIonModalElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  //const [langInfo, setLangInfo] = useState<LanguageInfo>();
  const [filter, setFilter] = useState<string>('');

  const [phraseWithVoteList, setPhraseWithVoteList] =
    useState<PhraseWithVoteListOutput>();

  const [getPhrasesByLanguage, { data: phrasesData, error, loading, called }] =
    useGetPhrasesByLanguageLazyQuery();
  const [togglePhraseVoteStatus] = useTogglePhraseVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePhraseVoteStatus.vote_status &&
        data.togglePhraseVoteStatus.error === ErrorType.NoError &&
        phrasesData &&
        phrasesData.getPhrasesByLanguage.error === ErrorType.NoError &&
        targetLang
      ) {
        const newVoteStatus = data.togglePhraseVoteStatus.vote_status;

        cache.updateFragment<PhraseWithDefinitions>(
          {
            id: cache.identify({
              __typename: 'PhraseWithDefinitions',
              phrase_id: newVoteStatus.phrase_id,
            }),
            fragment: PhraseWithDefinitionsFragmentFragmentDoc,
            fragmentName: 'PhraseWithDefinitionsFragment',
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

        cache.updateFragment<PhraseWithVote>(
          {
            id: cache.identify({
              __typename: 'PhraseWithVote',
              phrase_id: newVoteStatus.phrase_id,
            }),
            fragment: PhraseWithVoteFragmentFragmentDoc,
            fragmentName: 'PhraseWithVoteFragment',
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
      } else {
        console.log('useTogglePhraseVoteStatusMutation: ', errors);
        console.log(data?.togglePhraseVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.togglePhraseVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
  const [upsertPhrase] = usePhraseUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.phraseUpsert.phrase &&
        data.phraseUpsert.error === ErrorType.NoError &&
        phrasesData &&
        phrasesData.getPhrasesByLanguage.error === ErrorType.NoError &&
        targetLang
      ) {
        const newPhrase = data.phraseUpsert.phrase;

        cache.writeQuery({
          query: GetPhrasesByLanguageDocument,
          data: {
            ...phrasesData,
            getWordsByLanguage: {
              ...phrasesData.getPhrasesByLanguage,
              phrase_with_vote_list: [
                ...phrasesData.getPhrasesByLanguage.phrase_with_vote_list,
                {
                  ...newPhrase,
                  __typename: 'PhraseWithDefinitions',
                  definitionlike_strings: [],
                  upvotes: 0,
                  downvotes: 0,
                },
              ],
            },
          },
          variables: {
            language_code: targetLang.lang.tag,
            dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
            geo_code: targetLang.region ? targetLang.region.tag : null,
          },
        });

        present({
          message: tr('Success at creating new phrase!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('usePhraseUpsertMutation: ', errors);
        console.log(data?.phraseUpsert.error);

        present({
          message: `${tr('Failed at creating new phrase!')} [${data
            ?.phraseUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });

  useEffect(() => {
    if (!targetLang) {
      return;
    }

    getPhrasesByLanguage({
      variables: {
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        filter: filter.trim(),
      },
    });
  }, [targetLang, getPhrasesByLanguage, filter]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (phrasesData) {
      if (phrasesData.getPhrasesByLanguage.error !== ErrorType.NoError) {
        return;
      }
      setPhraseWithVoteList(phrasesData.getPhrasesByLanguage);
    }
  }, [phrasesData, error, loading, called]);

  const handleGoToDefinitionDetail = useCallback(
    (phraseId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-detail/${phraseId}`,
      );
    },
    [match, router],
  );

  const handleSaveNewDefinition = () => {
    if (!targetLang) {
      return;
    }

    const textareaEl = textarea.current;
    if (!textareaEl) {
      present({
        message: tr('Input or Textarea not exists!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    const textareaVal = (textareaEl.value + '').trim();

    if (textareaVal.length === 0) {
      present({
        message: tr('Phrase cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertPhrase({
      variables: {
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        phraselike_string: textareaVal.trim(),
      },
    });
  };

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const phrases = useMemo(() => {
    const tempPhrases: {
      phrase_id: string;
      phrase: string;
      definitionlike_strings: string[];
      downvotes: number;
      upvotes: number;
    }[] = [];

    if (!phraseWithVoteList) {
      return tempPhrases;
    }

    for (const phraseWithVote of phraseWithVoteList.phrase_with_vote_list) {
      if (phraseWithVote) {
        tempPhrases.push({
          phrase_id: phraseWithVote.phrase_id,
          phrase: phraseWithVote.phrase,
          definitionlike_strings: phraseWithVote.definitions.map(
            (definition) => definition?.definition,
          ) as string[],
          upvotes: phraseWithVote.upvotes,
          downvotes: phraseWithVote.downvotes,
        });
      }
    }

    return tempPhrases;
  }, [phraseWithVoteList]);

  const cardListComs = phrases
    ? phrases.map((phrase) => (
        <CardContainer key={phrase.phrase_id}>
          <Card
            content={phrase.phrase}
            description={
              <ul style={{ listStyleType: 'circle' }}>
                {phrase.definitionlike_strings.map((str) => (
                  <li key={str}>{str}</li>
                ))}
              </ul>
            }
            vote={{
              upVotes: phrase.upvotes,
              downVotes: phrase.downvotes,
              onVoteUpClick: () => {
                togglePhraseVoteStatus({
                  variables: {
                    phrase_id: phrase.phrase_id,
                    vote: true,
                  },
                });
              },
              onVoteDownClick: () => {
                togglePhraseVoteStatus({
                  variables: {
                    phrase_id: phrase.phrase_id,
                    vote: false,
                  },
                });
              },
            }}
            voteFor="content"
            onClick={() => handleGoToDefinitionDetail(phrase.phrase_id)}
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
              <Caption>{tr('Phrase Book')}</Caption>
            </CaptainContainer>

            <br />

            <FilterContainer>
              <LangSelector
                title={tr('Select language')}
                langSelectorId="phrase-book-langSelector"
                selected={targetLang ?? undefined}
                onChange={(_sourceLangTag, sourceLangInfo) => {
                  setTargetLanguage(sourceLangInfo);
                }}
                onClearClick={() => setTargetLanguage(null)}
              />
              <Input
                type="text"
                label={tr('Search')}
                labelPlacement="floating"
                fill="outline"
                debounce={300}
                value={filter}
                onIonInput={handleFilterChange}
              />
            </FilterContainer>

            <hr />

            <IonButton id="open-phrase-modal" expand="block">
              + {tr('Add More Phrase')}
            </IonButton>

            <br />

            <CardListContainer>{cardListComs}</CardListContainer>

            <IonModal ref={modal} trigger="open-phrase-modal">
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
                  <Textarea
                    ref={textarea}
                    labelPlacement="floating"
                    fill="solid"
                    label={tr('Input New Phrase')}
                  />
                  <IonButton onClick={handleSaveNewDefinition}>
                    {tr('Save')}
                  </IonButton>
                </div>
              </IonContent>
            </IonModal>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
