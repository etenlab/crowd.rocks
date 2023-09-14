import { useState, useEffect, useMemo, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonToolbar,
  IonHeader,
  IonTitle,
  useIonRouter,
  InputCustomEvent,
  InputChangeEventDetail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { Card } from '../../common/Card';
import { Input } from '../../common/styled';

import { useGetPhrasesByLanguageLazyQuery } from '../../../generated/graphql';

import { useTogglePhraseVoteStatusMutation } from '../../../hooks/useTogglePhraseVoteStatusMutation';

import { ErrorType, TableNameType } from '../../../generated/graphql';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import {
  CaptionContainer,
  FilterContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { AddListHeader } from '../../common/ListHeader';
import { PageLayout } from '../../common/PageLayout';
import { NewPhraseForm } from '../NewPhraseForm';

import { PAGE_SIZE } from '../../../const/commonConst';

interface PhraseListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function PhraseListPage({ match }: PhraseListPageProps) {
  const router = useIonRouter();
  const { tr } = useTr();
  // const [present] = useIonToast();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
    actions: { setTargetLanguage },
  } = useAppContext();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('');

  const [getPhrasesByLanguage, { data: phrasesData, error, fetchMore }] =
    useGetPhrasesByLanguageLazyQuery();
  const [togglePhraseVoteStatus] = useTogglePhraseVoteStatusMutation();

  useEffect(() => {
    if (!targetLang) {
      return;
    }

    getPhrasesByLanguage({
      variables: {
        first: PAGE_SIZE,
        after: null,
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
        geo_code: targetLang.region ? targetLang.region.tag : null,
        filter: filter.trim(),
      },
    });
  }, [targetLang, getPhrasesByLanguage, filter]);

  const handleGoToDefinitionDetail = useCallback(
    (phraseId: string) => {
      router.push(
        `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-detail/${phraseId}`,
      );
    },
    [match, router],
  );

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (
        phrasesData?.getPhrasesByLanguage.pageInfo.hasNextPage &&
        targetLang
      ) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: phrasesData.getPhrasesByLanguage.pageInfo.endCursor,
            language_code: targetLang.lang.tag,
            dialect_code: targetLang.dialect ? targetLang.dialect.tag : null,
            geo_code: targetLang.region ? targetLang.region.tag : null,
            filter: filter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, filter, phrasesData, targetLang],
  );

  const cardListComs = useMemo(() => {
    const tempPhrases: {
      phrase_id: string;
      phrase: string;
      definitionlike_strings: string[];
      downvotes: number;
      upvotes: number;
    }[] = [];

    if (error) {
      return null;
    }

    if (
      !phrasesData ||
      phrasesData.getPhrasesByLanguage.error !== ErrorType.NoError
    ) {
      return null;
    }

    const phraseWithVoteListEdges = phrasesData.getPhrasesByLanguage.edges;

    for (const edge of phraseWithVoteListEdges) {
      const { node } = edge;

      if (node) {
        tempPhrases.push({
          phrase_id: node.phrase_id,
          phrase: node.phrase,
          definitionlike_strings: node.definitions.map(
            (definition) => definition?.definition,
          ) as string[],
          upvotes: node.upvotes,
          downvotes: node.downvotes,
        });
      }
    }

    // TODO: reeeeeally need to use a generic sortByKey thing.
    return tempPhrases
      .sort((a, b) => {
        const keyA = a.phrase.toLowerCase();
        const keyB = b.phrase.toLowerCase();
        if (keyA > keyB) return 1;
        if (keyA < keyB) return -1;
        return 0;
      })
      .map((phrase) => (
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
            discussion={{
              onChatClick: () =>
                router.push(
                  `/${match.params.nation_id}/${match.params.language_id}/1/discussion/phrases/${phrase.phrase_id}`,
                ),
            }}
            flags={{
              parent_table: TableNameType.Phrases,
              parent_id: phrase.phrase_id,
              flag_names: WORD_AND_PHRASE_FLAGS,
            }}
            voteFor="content"
            onClick={() => handleGoToDefinitionDetail(phrase.phrase_id)}
          />
        </CardContainer>
      ));
  }, [
    error,
    handleGoToDefinitionDetail,
    match.params.language_id,
    match.params.nation_id,
    phrasesData,
    router,
    togglePhraseVoteStatus,
  ]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Phrase Book')}</Caption>
      </CaptionContainer>

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

      <AddListHeader
        title={tr('All Phrases')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{cardListComs}</CardListContainer>

      <IonInfiniteScroll onIonInfinite={handleInfinite}>
        <IonInfiniteScrollContent
          loadingText={`${tr('Loading')}...`}
          loadingSpinner="bubbles"
        />
      </IonInfiniteScroll>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Phrase')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {targetLang ? (
            <NewPhraseForm
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
