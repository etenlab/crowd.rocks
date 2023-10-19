import { useCallback, useEffect, useMemo } from 'react';
import { useIonToast } from '@ionic/react';
import { Stack } from '@mui/material';

import {
  ErrorType,
  TableNameType,
  useGetMapWordOrPhraseAsOrigByDefinitionIdQuery,
  useGetTranslationsByFromDefinitionIdQuery,
  useToggleTranslationVoteStatusMutation,
} from '../../../generated/graphql';

import { useAppContext } from '../../../hooks/useAppContext';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

import { WordCard } from '../../common/WordCard';

export type MapWordOrPhraseTranslationListProps = {
  definition_id: string;
  definition_type: string;
};

export function MapWordOrPhraseTranslationList({
  definition_id,
  definition_type,
}: MapWordOrPhraseTranslationListProps) {
  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { updatedTrDefinitionIds },
      },
    },
    actions: { setUpdatedTrDefinitionIds },
  } = useAppContext();

  const [present] = useIonToast();

  const wordOrPhraseQ = useGetMapWordOrPhraseAsOrigByDefinitionIdQuery({
    variables: {
      definition_id,
      is_word_definition: definition_type === 'word',
    },
  });

  const translationsQ = useGetTranslationsByFromDefinitionIdQuery({
    variables: {
      definition_id,
      from_definition_type_is_word: definition_type === 'word',
      language_code: targetLang?.lang.tag || '',
      dialect_code: targetLang?.dialect?.tag,
      geo_code: targetLang?.region?.tag,
    },
  });

  const [toggleTrVoteStatus, { data: voteData, loading: voteLoading }] =
    useToggleTranslationVoteStatusMutation({
      refetchQueries: ['GetTranslationsByFromDefinitionId'],
    });

  useEffect(() => {
    if (voteLoading) return;
    if (
      voteData &&
      voteData?.toggleTranslationVoteStatus.error !== ErrorType.NoError
    ) {
      present({
        message: voteData?.toggleTranslationVoteStatus.error,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }
  }, [present, voteData, voteLoading]);

  const handleVoteClick = useCallback(
    (
      translation_id: string,
      from_definition_type_is_word: boolean,
      to_definition_type_is_word: boolean,
      vote: boolean,
    ): void => {
      toggleTrVoteStatus({
        variables: {
          from_definition_type_is_word,
          to_definition_type_is_word,
          translation_id,
          vote,
        },
      });
      setUpdatedTrDefinitionIds([...updatedTrDefinitionIds, definition_id]);
    },
    [
      definition_id,
      setUpdatedTrDefinitionIds,
      toggleTrVoteStatus,
      updatedTrDefinitionIds,
    ],
  );

  const original = useMemo(() => {
    const wordOrPhrase =
      wordOrPhraseQ.data?.getMapWordOrPhraseAsOrigByDefinitionId.wordOrPhrase;
    const isWord = wordOrPhrase?.__typename === 'WordWithDefinition';
    const isPhrase = wordOrPhrase?.__typename === 'PhraseWithDefinition';
    const value = isWord
      ? wordOrPhrase?.word
      : isPhrase
      ? wordOrPhrase?.phrase
      : '';
    const id = isWord
      ? wordOrPhrase?.word_id
      : isPhrase
      ? wordOrPhrase?.phrase_id
      : '';
    const username = wordOrPhrase?.created_by_user.avatar;
    const avatar = wordOrPhrase?.created_by_user.avatar_url;
    const createdAt = wordOrPhrase?.created_at;

    return {
      isWord,
      isPhrase,
      wordOrPhrase,
      value,
      id,
      definition: wordOrPhrase?.definition,
      author: {
        username,
        avatar,
        createdAt,
      },
    };
  }, [wordOrPhraseQ]);

  const trans = useMemo(() => {
    return translationsQ.data?.getTranslationsByFromDefinitionId.translation_with_vote_list
      .map((translation) => {
        if (!translation) {
          return null;
        }

        let value: string = '';
        let id: string = '';
        let to_type: 'phrase' | 'word' = 'word';
        let definition_id: string = '';
        let definition: string = '';
        let username: string = '';
        let avatar: string | null | undefined;
        let createdAt: Date = new Date();
        let parent: { id: string; table: string } = { id: '', table: '' };

        if (translation?.__typename === 'PhraseToPhraseTranslationWithVote') {
          value = translation.to_phrase_definition.phrase.phrase;
          id = translation.phrase_to_phrase_translation_id;
          to_type = 'phrase';
          definition_id = translation.to_phrase_definition.phrase_definition_id;
          definition = translation.to_phrase_definition.definition;
          username = translation.to_phrase_definition.created_by_user.avatar;
          avatar = translation.to_phrase_definition.created_by_user.avatar_url;
          createdAt = new Date(translation.to_phrase_definition.created_at);
          parent = {
            id: translation.phrase_to_phrase_translation_id,
            table: 'phrase_to_phrase_translations',
          };
        }
        if (translation?.__typename === 'PhraseToWordTranslationWithVote') {
          value = translation.to_word_definition.word.word;
          id = translation.phrase_to_word_translation_id;
          to_type = 'word';
          definition_id = translation.to_word_definition.word_definition_id;
          definition = translation.to_word_definition.definition;
          username = translation.to_word_definition.created_by_user.avatar;
          avatar = translation.to_word_definition.created_by_user.avatar_url;
          createdAt = new Date(translation.to_word_definition.created_at);
          parent = {
            id: translation.phrase_to_word_translation_id,
            table: 'phrase_to_word_translations',
          };
        }
        if (translation?.__typename === 'WordToPhraseTranslationWithVote') {
          value = translation.to_phrase_definition.phrase.phrase;
          id = translation.word_to_phrase_translation_id;
          to_type = 'phrase';
          definition = translation.to_phrase_definition.definition;
          definition_id = translation.to_phrase_definition.phrase_definition_id;
          username = translation.to_phrase_definition.created_by_user.avatar;
          avatar = translation.to_phrase_definition.created_by_user.avatar_url;
          createdAt = new Date(translation.to_phrase_definition.created_at);
          parent = {
            id: translation.word_to_phrase_translation_id,
            table: 'word_to_phrase_translations',
          };
        }
        if (translation?.__typename === 'WordToWordTranslationWithVote') {
          value = translation.to_word_definition.word.word;
          id = translation.word_to_word_translation_id;
          to_type = 'word';
          definition = translation.to_word_definition.definition;
          definition_id = translation.to_word_definition.word_definition_id;
          username = translation.to_word_definition.created_by_user.avatar;
          avatar = translation.to_word_definition.created_by_user.avatar_url;
          createdAt = new Date(translation.to_word_definition.created_at);
          parent = {
            id: translation.word_to_word_translation_id,
            table: 'word_to_word_translations',
          };
        }
        return {
          key: `${translation.__typename}:${id}`,
          value,
          id,
          to_type,
          definition_id,
          definition,
          upvotes: translation.upvotes,
          downvotes: translation.downvotes,
          author: {
            username,
            avatar,
            createdAt,
          },
          parent,
        };
      })
      .filter((item) => item) as {
      key: string;
      value: string;
      id: string;
      to_type: 'phrase' | 'word';
      definition_id: string;
      definition: string;
      upvotes: number;
      downvotes: number;
      author: {
        username: string;
        avatar?: string;
        createdAt: Date;
      };
      parent: {
        id: string;
        table: string;
      };
    }[];
  }, [translationsQ]);

  return (
    <Stack gap="24px">
      {trans &&
        trans.map((item) => (
          <WordCard
            key={item.key}
            word={item.value}
            description={item.definition}
            discussion={{
              parent_id: item.parent.id,
              parent_table: item.parent.table,
            }}
            author={item.author}
            flags={{
              parent_table:
                item.to_type === 'word'
                  ? TableNameType.WordDefinitions
                  : TableNameType.PhraseDefinitions,
              parent_id: item.definition_id!,
              flag_names: WORD_AND_PHRASE_FLAGS,
            }}
            vote={{
              upVotes: item.upvotes,
              downVotes: item.downvotes,
              onVoteUpClick: () => {
                handleVoteClick(
                  item.id,
                  original.isWord,
                  item.to_type === 'word',
                  true,
                );
              },
              onVoteDownClick: () => {
                handleVoteClick(
                  item.id,
                  original.isWord,
                  item.to_type === 'word',
                  false,
                );
              },
            }}
          />
        ))}
    </Stack>
  );
}
