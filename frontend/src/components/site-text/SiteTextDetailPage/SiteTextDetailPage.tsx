import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonRouter,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';
import { Card } from '../../common/Card';

import {
  useGetAllTranslationFromSiteTextDefinitionIdLazyQuery,
  useSiteTextPhraseDefinitionReadLazyQuery,
  useSiteTextWordDefinitionReadLazyQuery,
} from '../../../generated/graphql';

import { ErrorType, TableNameType } from '../../../generated/graphql';

import {
  CaptionContainer,
  CardListContainer,
  CardContainer,
} from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useToggleTranslationVoteStatusMutation } from '../../../hooks/useToggleTranslationVoteStatusMutation';

import { AddListHeader } from '../../common/ListHeader';
import { PageLayout } from '../../common/PageLayout';
import { NewSiteTextTranslationForm } from '../NewSiteTextTranslationForm';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

interface SiteTextDetailPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
    site_text_id: string;
    definition_type: string;
  }> {}

export function SiteTextDetailPage({ match }: SiteTextDetailPageProps) {
  const { tr } = useTr();
  // const [present] = useIonToast();
  const router = useIonRouter();
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [
    getAllTranslationFromSiteTextDefinitionID,
    { data: translationsData, error: translationsError },
  ] = useGetAllTranslationFromSiteTextDefinitionIdLazyQuery();
  const [siteTextWordDefinitionRead, { data: wordData, error: wordError }] =
    useSiteTextWordDefinitionReadLazyQuery();
  const [
    siteTextPhraseDefinitionRead,
    { data: phraseData, error: phraseError },
  ] = useSiteTextPhraseDefinitionReadLazyQuery();

  const [toggleVoteStatus] = useToggleTranslationVoteStatusMutation();

  useEffect(() => {
    if (!targetLang) {
      return;
    }

    getAllTranslationFromSiteTextDefinitionID({
      variables: {
        site_text_id: match.params.site_text_id,
        site_text_type_is_word:
          match.params.definition_type === 'word' ? true : false,
        language_code: targetLang.lang.tag,
        dialect_code: targetLang.dialect?.tag,
        geo_code: targetLang.region?.tag,
      },
    });
  }, [getAllTranslationFromSiteTextDefinitionID, match, targetLang]);

  useEffect(() => {
    if (match.params.definition_type === 'word') {
      siteTextWordDefinitionRead({
        variables: {
          id: match.params.site_text_id,
        },
      });
    } else {
      siteTextPhraseDefinitionRead({
        variables: {
          id: match.params.site_text_id,
        },
      });
    }
  }, [siteTextWordDefinitionRead, siteTextPhraseDefinitionRead, match]);

  const wordCom = useMemo(() => {
    if (wordError) {
      return null;
    }

    if (
      !wordData ||
      wordData.siteTextWordDefinitionRead.error !== ErrorType.NoError
    ) {
      return null;
    }

    const siteTextWordDefinition =
      wordData.siteTextWordDefinitionRead.site_text_word_definition;

    if (!siteTextWordDefinition) {
      return null;
    }

    return (
      <Card
        content={siteTextWordDefinition.word_definition.word.word}
        description={siteTextWordDefinition.word_definition.definition}
      />
    );
  }, [wordData, wordError]);

  const phraseCom = useMemo(() => {
    if (phraseError) {
      return null;
    }

    if (
      !phraseData ||
      phraseData.siteTextPhraseDefinitionRead.error !== ErrorType.NoError
    ) {
      return null;
    }

    const siteTextPhraseDefinition =
      phraseData.siteTextPhraseDefinitionRead.site_text_phrase_definition;

    if (!siteTextPhraseDefinition) {
      return null;
    }

    return (
      <Card
        content={siteTextPhraseDefinition.phrase_definition.phrase.phrase}
        description={siteTextPhraseDefinition.phrase_definition.definition}
      />
    );
  }, [phraseData, phraseError]);

  const translationsCom = useMemo(() => {
    const tempTranslations: {
      key: string;
      translationId: string;
      from_type_is_word: boolean;
      to_type_is_word: boolean;
      siteTextlikeString: string;
      definitionlikeString: string;
      definition_id: string;
      upvotes: number;
      downvotes: number;
      to_word_or_phrase_id: string;
    }[] = [];

    if (translationsError) {
      return null;
    }

    if (
      !translationsData ||
      translationsData.getAllTranslationFromSiteTextDefinitionID.error !==
        ErrorType.NoError
    ) {
      return null;
    }

    const translationWithVoteList =
      translationsData.getAllTranslationFromSiteTextDefinitionID
        .translation_with_vote_list;

    if (!translationWithVoteList) {
      return null;
    }

    for (const translationWithVote of translationWithVoteList) {
      if (!translationWithVote) {
        continue;
      }

      switch (translationWithVote.__typename) {
        case 'WordToWordTranslationWithVote': {
          tempTranslations.push({
            key: `WordToWordTranslationWithVote${translationWithVote.word_to_word_translation_id}`,
            translationId: translationWithVote.word_to_word_translation_id,
            from_type_is_word: true,
            to_type_is_word: true,
            siteTextlikeString:
              translationWithVote.to_word_definition.word.word,
            definitionlikeString:
              translationWithVote.to_word_definition.definition,
            definition_id:
              translationWithVote.to_word_definition.word_definition_id,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
            to_word_or_phrase_id:
              translationWithVote.to_word_definition.word.word_id,
          });
          break;
        }
        case 'WordToPhraseTranslationWithVote': {
          tempTranslations.push({
            key: `WordToPhraseTranslationWithVote${translationWithVote.word_to_phrase_translation_id}`,
            translationId: translationWithVote.word_to_phrase_translation_id,
            from_type_is_word: true,
            to_type_is_word: false,
            siteTextlikeString:
              translationWithVote.to_phrase_definition.phrase.phrase,
            definitionlikeString:
              translationWithVote.to_phrase_definition.definition,
            definition_id:
              translationWithVote.to_phrase_definition.phrase_definition_id,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
            to_word_or_phrase_id:
              translationWithVote.to_phrase_definition.phrase.phrase_id,
          });
          break;
        }
        case 'PhraseToWordTranslationWithVote': {
          tempTranslations.push({
            key: `PhraseToWordTranslationWithVote-${translationWithVote.phrase_to_word_translation_id}`,
            translationId: translationWithVote.phrase_to_word_translation_id,
            from_type_is_word: false,
            to_type_is_word: true,
            siteTextlikeString:
              translationWithVote.to_word_definition.word.word,
            definitionlikeString:
              translationWithVote.to_word_definition.definition,
            definition_id:
              translationWithVote.to_word_definition.word_definition_id,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
            to_word_or_phrase_id:
              translationWithVote.to_word_definition.word.word_id,
          });
          break;
        }
        case 'PhraseToPhraseTranslationWithVote': {
          tempTranslations.push({
            key: `PhraseToPhraseTranslationWithVote-${translationWithVote.phrase_to_phrase_translation_id}`,
            translationId: translationWithVote.phrase_to_phrase_translation_id,
            from_type_is_word: false,
            to_type_is_word: false,
            siteTextlikeString:
              translationWithVote.to_phrase_definition.phrase.phrase,
            definitionlikeString:
              translationWithVote.to_phrase_definition.definition,
            definition_id:
              translationWithVote.to_phrase_definition.phrase_definition_id,
            upvotes: translationWithVote.upvotes,
            downvotes: translationWithVote.downvotes,
            to_word_or_phrase_id:
              translationWithVote.to_phrase_definition.phrase.phrase_id,
          });
          break;
        }
      }
    }

    return tempTranslations.map((translation) => (
      <CardContainer key={translation.key}>
        <Card
          content={translation.siteTextlikeString}
          description={translation.definitionlikeString}
          vote={{
            upVotes: translation.upvotes,
            downVotes: translation.downvotes,
            onVoteUpClick: () => {
              toggleVoteStatus({
                variables: {
                  translation_id: translation.translationId + '',
                  from_definition_type_is_word: translation.from_type_is_word,
                  to_definition_type_is_word: translation.to_type_is_word,
                  vote: true,
                },
              });
            },
            onVoteDownClick: () => {
              toggleVoteStatus({
                variables: {
                  translation_id: translation.translationId + '',
                  from_definition_type_is_word: translation.from_type_is_word,
                  to_definition_type_is_word: translation.to_type_is_word,
                  vote: false,
                },
              });
            },
          }}
          voteFor="description"
          discussion={{
            onChatClick: () =>
              router.push(
                `/${match.params.nation_id}/${
                  match.params.language_id
                }/1/discussion/${
                  translation.to_type_is_word ? 'words' : 'phrases'
                }/${translation.to_word_or_phrase_id}`,
              ),
          }}
          flags={{
            parent_table: translation.to_type_is_word
              ? TableNameType.WordDefinitions
              : TableNameType.PhraseDefinitions,
            parent_id: translation.definition_id,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
        />
      </CardContainer>
    ));
  }, [
    translationsError,
    translationsData,
    toggleVoteStatus,
    router,
    match.params.nation_id,
    match.params.language_id,
  ]);

  let title = 'Loading';
  title =
    wordData?.siteTextWordDefinitionRead?.site_text_word_definition
      ?.word_definition.word.word || title;
  title =
    phraseData?.siteTextPhraseDefinitionRead?.site_text_phrase_definition
      ?.phrase_definition?.phrase.phrase || title;

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>
          {tr('Site Text')} - {title}
        </Caption>
      </CaptionContainer>

      <CardContainer>
        {wordCom}
        {phraseCom}
      </CardContainer>

      <AddListHeader
        title={tr('Site Text Translations')}
        onClick={() => setIsOpenModal(true)}
      />

      <CardListContainer>{translationsCom}</CardListContainer>

      <IonModal isOpen={isOpenModal} onDidDismiss={() => setIsOpenModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{tr('Add New Translation')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {targetLang ? (
            <NewSiteTextTranslationForm
              site_text_id={+match.params.site_text_id}
              is_word_definition={
                match.params.definition_type === 'word' ? true : false
              }
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
