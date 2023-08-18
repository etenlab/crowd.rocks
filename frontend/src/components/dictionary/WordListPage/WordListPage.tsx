import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonModal,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  useIonRouter,
  InputCustomEvent,
  InputChangeEventDetail,
} from '@ionic/react';
import { IonContent, useIonToast } from '@ionic/react';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';
import { AddListHeader } from '../../common/ListHeader';
import { Input, Textarea } from '../../common/styled';

import {
  useGetWordsByLanguageLazyQuery,
  useToggleWordVoteStatusMutation,
  useWordUpsertMutation,
} from '../../../generated/graphql';

import {
  WordWithVoteListOutput,
  WordWithDefinitions,
  WordWithVote,
  ErrorType,
} from '../../../generated/graphql';

import {
  WordWithDefinitionsFragmentFragmentDoc,
  WordWithVoteFragmentFragmentDoc,
  GetWordsByLanguageDocument,
} from '../../../generated/graphql';

import {
  CaptainContainer,
  FilterContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

interface WordListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function WordListPage({ match }: WordListPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [present] = useIonToast();

  const modal = useRef<HTMLIonModalElement>(null);
  const textarea = useRef<HTMLIonTextareaElement>(null);

  const [showModal, setShowModal] = useState(false);

  const [filter, setFilter] = useState<string>('');

  const [wordWithVoteList, setWordWithVoteList] =
    useState<WordWithVoteListOutput>();

  const [getWordsByLanguage, { data: wordsData, error, loading, called }] =
    useGetWordsByLanguageLazyQuery();
  const [toggleWordVoteStatus] = useToggleWordVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleWordVoteStatus.vote_status &&
        data.toggleWordVoteStatus.error === ErrorType.NoError &&
        wordsData &&
        wordsData.getWordsByLanguage.error === ErrorType.NoError &&
        targetLang
      ) {
        const newVoteStatus = data.toggleWordVoteStatus.vote_status;

        cache.updateFragment<WordWithDefinitions>(
          {
            id: cache.identify({
              __typename: 'WordWithDefinitions',
              word_id: newVoteStatus.word_id,
            }),
            fragment: WordWithDefinitionsFragmentFragmentDoc,
            fragmentName: 'WordWithDefinitionsFragment',
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
      } else {
        console.log('useToggleWordVoteStatusMutation: ', errors);
        console.log(data?.toggleWordVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.toggleWordVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
  const [upsertWord] = useWordUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.wordUpsert.word &&
        data.wordUpsert.error === ErrorType.NoError &&
        wordsData &&
        wordsData.getWordsByLanguage.error === ErrorType.NoError &&
        targetLang
      ) {
        const newWord = data.wordUpsert.word;

        cache.writeQuery({
          query: GetWordsByLanguageDocument,
          data: {
            ...wordsData,
            getWordsByLanguage: {
              ...wordsData.getWordsByLanguage,
              word_with_vote_list: [
                ...wordsData.getWordsByLanguage.word_with_vote_list,
                {
                  ...newWord,
                  __typename: 'WordWithDefinitions',
                  definitionlike_strings: [],
                  upvotes: 0,
                  downvotes: 0,
                  created_at: new Date().toISOString(),
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
          message: tr('Success at creating new word!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });

        modal.current?.dismiss();
      } else {
        console.log('useWordUpsertMutation: ', errors);
        console.log(data?.wordUpsert.error);

        present({
          message: `${tr('Failed at creating new word!')} [${data?.wordUpsert
            .error}]`,
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

    getWordsByLanguage({
      variables: {
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        filter: filter.trim(),
      },
    });
  }, [targetLang, getWordsByLanguage, filter]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (loading || !called) {
      return;
    }

    if (wordsData) {
      if (wordsData.getWordsByLanguage.error !== ErrorType.NoError) {
        return;
      }
      setWordWithVoteList(wordsData.getWordsByLanguage);
    }
  }, [wordsData, error, loading, called]);

  const handleGoToDefinitionDetail = useCallback(
    (wordId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-detail/${wordId}`,
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
        message: tr('Word cannot be empty string!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    upsertWord({
      variables: {
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        wordlike_string: textareaVal.trim(),
      },
    });
  };

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

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
          definitionlike_strings: wordWithVote.definitions.map(
            (definition) => definition?.definition,
          ) as string[],
          upvotes: wordWithVote.upvotes,
          downvotes: wordWithVote.downvotes,
        });
      }
    }

    // TODO: make a cool generic function sort<T>() that can sort on any keyof T
    // we already have another sort function for sitetext that essentially does the
    // same thing as this, just with a different key.
    return tempWords.sort((a, b) => {
      const wordA = a.word.toLowerCase();
      const wordB = b.word.toLowerCase();
      if (wordA > wordB) return 1;
      if (wordA < wordB) return -1;
      return 0;
    });
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
    <PageLayout>
      <CaptainContainer>
        <Caption>{tr('Dictionary')}</Caption>
      </CaptainContainer>

      <FilterContainer>
        <LangSelector
          title={tr('Select language')}
          langSelectorId="dictionary-langSelector"
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

      <AddListHeader title={tr('Words')} onClick={() => setShowModal(true)} />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonModal ref={modal} isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)}>
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
              label={tr('Input New Word')}
            />
            <IonButton onClick={handleSaveNewDefinition}>
              {tr('Save')}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </PageLayout>
  );
}
