import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { typeOfString, StringContentTypes } from '../../../common/utility';
import {
  ErrorType,
  useGetRecommendedTranslationFromDefinitionIdLazyQuery,
  useGetTranslationsByFromDefinitionIdLazyQuery,
} from '../../../generated/graphql';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';

import { useTranslationTools } from '../hooks/useTranslationTools';
import { useAppContext } from '../../../hooks/useAppContext';
import { WordItem } from '../../common/WordItem';
import { OriginalData } from '../hooks/useTranslationTools';
import { langInfo2tag } from '../../../../../utils';

export type TranslationItemProps = {
  original: OriginalData;
  targetLang: LanguageInfo | null;
  redirectUrl: string;
};

export function TranslationItem({
  original,
  targetLang,
  redirectUrl,
}: TranslationItemProps) {
  const history = useHistory();
  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    states: {
      global: {
        maps: { tempTranslations },
      },
    },
    actions: { setTempTranslation, clearTempTranslation },
  } = useAppContext();
  const { getTransformedTranslations } = useTranslationTools();

  const [saving, setSaving] = useState<boolean>(false);

  const [getRecommendedTranslationFromDefinitionId, { data, loading, error }] =
    useGetRecommendedTranslationFromDefinitionIdLazyQuery();

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

  const [getTranslationsQ] = useGetTranslationsByFromDefinitionIdLazyQuery();

  useEffect(() => {
    // if (targetLang) {
    //   getRecommendedTranslationFromDefinitionId({
    //     variables: {
    //       from_definition_id: original.definition.id,
    //       from_type_is_word: original.isWord,
    //       language_code: targetLang.lang.tag,
    //       dialect_code: targetLang.dialect?.tag,
    //       geo_code: targetLang.region?.tag,
    //     },
    //   });
    // }
  }, [getRecommendedTranslationFromDefinitionId, targetLang, original]);

  useEffect(() => {
    if (!saving) return;

    const formData =
      tempTranslations[
        `${original.definition.id}:${
          original.isWord ? StringContentTypes.WORD : StringContentTypes.PHRASE
        }`
      ];

    if (!targetLang || !formData) {
      setSaving(false);
      return;
    }

    (async () => {
      const translationsQ = await getTranslationsQ({
        variables: {
          definition_id: original.definition.id,
          from_definition_type_is_word: original.isWord,
          language_code: targetLang.lang.tag,
          dialect_code: targetLang.dialect?.tag,
          geo_code: targetLang.region?.tag,
        },
      });

      // dataTrs.getTranslationsByFromDefinitionId.translation_with_vote_list;
      if (!translationsQ?.data?.getTranslationsByFromDefinitionId) {
        return;
      }

      const { translations } = getTransformedTranslations(
        null,
        translationsQ.data.getTranslationsByFromDefinitionId
          .translation_with_vote_list,
      );

      const exists = translations.find(
        (item) => item.wordOrPhrase.likeString === formData.translation,
      );

      if (exists) {
        setSaving(false);
        history.push(
          `/${nation_id}/${language_id}/1/translation-confirm/${langInfo2tag(
            targetLang,
          )}/${original.definition.id}/${
            original.isWord
              ? StringContentTypes.WORD
              : StringContentTypes.PHRASE
          }?redirect_url=${redirectUrl}`,
        );
      } else {
        await upsertTranslation({
          variables: {
            language_code: targetLang?.lang.tag,
            dialect_code: targetLang?.dialect?.tag,
            geo_code: targetLang?.region?.tag,
            word_or_phrase: formData.translation,
            definition: formData.description,
            from_definition_id: original.definition.id,
            from_definition_type_is_word: original.isWord,
            is_type_word:
              typeOfString(formData.translation) === StringContentTypes.WORD,
          },
        });

        clearTempTranslation(
          `${original.definition.id}:${
            original.isWord
              ? StringContentTypes.WORD
              : StringContentTypes.PHRASE
          }`,
        );
        setSaving(false);
      }
    })();
  }, [
    targetLang,
    saving,
    tempTranslations,
    original,
    getTransformedTranslations,
    history,
    nation_id,
    language_id,
    upsertTranslation,
    clearTempTranslation,
    getTranslationsQ,
    redirectUrl,
  ]);

  const handleDetail = useCallback(() => {
    if (targetLang) {
      history.push(
        `/${nation_id}/${language_id}/1/translation-details/${langInfo2tag(
          targetLang,
        )}/${original.definition.id}/${
          original.isWord ? StringContentTypes.WORD : StringContentTypes.PHRASE
        }?redirect_url=${redirectUrl}`,
      );
    }
  }, [
    history,
    nation_id,
    language_id,
    targetLang,
    original.definition.id,
    original.isWord,
    redirectUrl,
  ]);

  const handleConfirm = useCallback(
    (translation: string, description: string) => {
      setTempTranslation(
        `${original.definition.id}:${
          original.isWord ? StringContentTypes.WORD : StringContentTypes.PHRASE
        }`,
        {
          translation,
          description,
        },
      );

      setSaving(true);
    },
    [setTempTranslation, original],
  );

  const handleCancel = useCallback(() => {
    clearTempTranslation(
      `${original.definition.id}:${
        original.isWord ? StringContentTypes.WORD : StringContentTypes.PHRASE
      }`,
    );
  }, [original, clearTempTranslation]);

  const translation = useMemo(() => {
    if (
      loading ||
      error ||
      !data ||
      data.getRecommendedTranslationFromDefinitionID.error !==
        ErrorType.NoError ||
      !data.getRecommendedTranslationFromDefinitionID.translation_with_vote
    ) {
      return null;
    }

    let word = '';
    let description = '';

    const temp =
      data.getRecommendedTranslationFromDefinitionID.translation_with_vote;

    switch (temp.__typename) {
      case 'WordToWordTranslationWithVote': {
        word = temp.to_word_definition.word.word;
        description = temp.to_word_definition.definition;
        break;
      }
      case 'WordToPhraseTranslationWithVote': {
        word = temp.to_phrase_definition.phrase.phrase;
        description = temp.to_phrase_definition.definition;
        break;
      }
      case 'PhraseToWordTranslationWithVote': {
        word = temp.to_word_definition.word.word;
        description = temp.to_word_definition.definition;
        break;
      }
      case 'PhraseToPhraseTranslationWithVote': {
        word = temp.to_phrase_definition.phrase.phrase;
        description = temp.to_phrase_definition.definition;
        break;
      }
    }

    return {
      word,
      description,
    };
  }, [data, loading, error]);

  return (
    <WordItem
      original={{
        word: original.wordOrPhrase.likeString,
        description: original.definition.likeString,
      }}
      translation={translation || undefined}
      onConfirm={(translation, description) => {
        handleConfirm(translation, description);
      }}
      disabledDetail={!targetLang}
      onDetail={handleDetail}
      onCancel={handleCancel}
      saving={saving}
    />
  );
}
