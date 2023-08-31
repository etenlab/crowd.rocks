import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonSpinner,
  IonModal,
  IonHeader,
  IonTitle,
  IonToolbar,
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
import { Input } from '../../common/styled';

import { useGetWordsByLanguageLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import {
  CaptionContainer,
  FilterContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useToggleWordVoteStatusMutation } from '../../../hooks/useToggleWordVoteStatusMutation';

import { NewWordForm } from '../NewWordForm';

import { PAGE_SIZE } from '../../../const/commonConst';

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

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('');

  const [getWordsByLanguage, { data: wordsData, loading, error, fetchMore }] =
    useGetWordsByLanguageLazyQuery();
  const [toggleWordVoteStatus] = useToggleWordVoteStatusMutation();

  useEffect(() => {
    if (!targetLang) {
      return;
    }

    getWordsByLanguage({
      variables: {
        first: PAGE_SIZE,
        after: null,
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        filter: filter.trim(),
      },
    });
  }, [targetLang, getWordsByLanguage, filter]);

  const handleGoToDefinitionDetail = useCallback(
    (wordId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-detail/${wordId}`,
      );
    },
    [match, router],
  );

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleFetchMore = () => {
    if (wordsData?.getWordsByLanguage.pageInfo.hasNextPage && targetLang) {
      fetchMore({
        variables: {
          first: PAGE_SIZE,
          after: wordsData.getWordsByLanguage.pageInfo.endCursor,
          language_code: targetLang.lang.tag,
          dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
          geo_code: targetLang.region ? targetLang.region.tag : null,
          filter: filter.trim(),
        },
      });
    }
  };

  const cardListComs = useMemo(() => {
    const tempWords: {
      word_id: string;
      word: string;
      definitionlike_strings: string[];
      downvotes: number;
      upvotes: number;
    }[] = [];

    if (error) {
      return null;
    }

    if (
      !wordsData ||
      wordsData.getWordsByLanguage.error !== ErrorType.NoError
    ) {
      return null;
    }

    const wordWithVoteListEdges = wordsData.getWordsByLanguage.edges;

    for (const edge of wordWithVoteListEdges) {
      const { node } = edge;

      if (node) {
        tempWords.push({
          word_id: node.word_id,
          word: node.word,
          definitionlike_strings: node.definitions.map(
            (definition) => definition?.definition,
          ) as string[],
          upvotes: node.upvotes,
          downvotes: node.downvotes,
        });
      }
    }

    // TODO: make a cool generic function sort<T>() that can sort on any keyof T
    // we already have another sort function for sitetext that essentially does the
    // same thing as this, just with a different key.
    return tempWords
      .sort((a, b) => {
        const wordA = a.word.toLowerCase();
        const wordB = b.word.toLowerCase();
        if (wordA > wordB) return 1;
        if (wordA < wordB) return -1;
        return 0;
      })
      .map((word) => (
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
            discussion={{
              onChatClick: () =>
                router.push(
                  `/${match.params.nation_id}/${match.params.language_id}/1/discussion/words/${word.word_id}/Dictionary: ${word.word}`,
                ),
            }}
            voteFor="content"
            onClick={() => handleGoToDefinitionDetail(word.word_id)}
          />
        </CardContainer>
      ));
  }, [
    error,
    handleGoToDefinitionDetail,
    match.params.language_id,
    match.params.nation_id,
    router,
    toggleWordVoteStatus,
    wordsData,
  ]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Dictionary')}</Caption>
      </CaptionContainer>

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

      <AddListHeader
        title={tr('Words')}
        onClick={() => {
          if (!targetLang) {
            present({
              message: `${tr('Please choose language!')}`,
              duration: 1500,
              position: 'top',
              color: 'danger',
            });
            return;
          }
          setIsOpenModal(true);
        }}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonButton
        fill="outline"
        shape="round"
        onClick={handleFetchMore}
        disabled={!wordsData?.getWordsByLanguage.pageInfo.hasNextPage}
      >
        {tr('Load More')}
        {loading ? <IonSpinner name="bubbles" /> : null}
      </IonButton>

      <IonModal isOpen={isOpenModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Word')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {targetLang ? (
            <NewWordForm
              langInfo={targetLang}
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
