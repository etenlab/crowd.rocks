import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router';

import { typeOfString, StringContentTypes } from '../../../common/utility';
import {
  ErrorType,
  GetRecommendedTranslationFromDefinitionIdDocument,
  MapWordOrPhrase,
  useGetRecommendedTranslationFromDefinitionIdLazyQuery,
  useGetTranslationsByFromDefinitionIdLazyQuery,
} from '../../../generated/graphql';
import { useUpsertTranslationFromWordAndDefinitionlikeStringMutation } from '../../../hooks/useUpsertTranslationFromWordAndDefinitionlikeStringMutation';

import { useMapTranslationTools } from '../hooks/useMapTranslationTools';
import { useAppContext } from '../../../hooks/useAppContext';
import { TranslatedTextItem } from '../../common/TranslatedTextItem';

export type MapWordItemProps = {
  original: MapWordOrPhrase;
};

export function MapWordItem({ original }: MapWordItemProps) {
  const history = useHistory();
  const { nation_id, language_id, id } = useParams<{
    id: string;
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    states: {
      global: {
        langauges: { targetLang },
        maps: { tempTranslations },
      },
    },
    actions: { setTempTranslation, clearTempTranslation },
  } = useAppContext();
  const { getTransformedTranslations } = useMapTranslationTools();

  const [saving, setSaving] = useState<boolean>(false);

  const [getRecommendedTranslationFromDefinitionId, { data, loading, error }] =
    useGetRecommendedTranslationFromDefinitionIdLazyQuery();

  const [upsertTranslation] =
    useUpsertTranslationFromWordAndDefinitionlikeStringMutation();

  const [getTranslationsQ] = useGetTranslationsByFromDefinitionIdLazyQuery();

  useEffect(() => {
    if (targetLang) {
      getRecommendedTranslationFromDefinitionId({
        variables: {
          from_definition_id: original.o_definition_id,
          from_type_is_word: original.type === StringContentTypes.WORD,
          language_code: targetLang.lang.tag,
          dialect_code: targetLang.dialect?.tag,
          geo_code: targetLang.region?.tag,
        },
      });
    }
  }, [getRecommendedTranslationFromDefinitionId, targetLang, original]);

  useEffect(() => {
    if (!saving) return;

    const formData =
      tempTranslations[`${original.o_definition_id}:${original.type}`];

    if (!targetLang || !formData) {
      setSaving(false);
      return;
    }

    (async () => {
      const translationsQ = await getTranslationsQ({
        variables: {
          definition_id: original.o_definition_id,
          from_definition_type_is_word:
            original.type === StringContentTypes.WORD,
          language_code: targetLang.lang.tag,
          dialect_code: targetLang.dialect?.tag,
          geo_code: targetLang.region?.tag,
        },
      });

      // dataTrs.getTranslationsByFromDefinitionId.translation_with_vote_list;
      if (!translationsQ?.data?.getTranslationsByFromDefinitionId) return;
      const t = getTransformedTranslations(
        null,
        translationsQ.data.getTranslationsByFromDefinitionId
          .translation_with_vote_list,
      );
      if (!t?.translations) return;

      const exists = t.translations.find(
        (item) => item.value === formData.translation,
      );

      if (exists) {
        setSaving(false);
        if (id === 'all') {
          history.push(
            `/${nation_id}/${language_id}/1/maps/translation_confirm/${original.o_definition_id}/${original.type}`,
          );
        } else {
          history.push(
            `/${nation_id}/${language_id}/1/maps/translation_confirm/${original.o_definition_id}/${original.type}?original_map_id=${id}`,
          );
        }
      } else {
        await upsertTranslation({
          variables: {
            language_code: targetLang?.lang.tag,
            dialect_code: targetLang?.dialect?.tag,
            geo_code: targetLang?.region?.tag,
            word_or_phrase: formData.translation,
            definition: formData.description,
            from_definition_id: original.o_definition_id,
            from_definition_type_is_word:
              original.type === StringContentTypes.WORD,
            is_type_word:
              typeOfString(formData.translation) === StringContentTypes.WORD,
          },
          refetchQueries: [GetRecommendedTranslationFromDefinitionIdDocument],
        });

        clearTempTranslation(`${original.o_definition_id}:${original.type}`);
        setSaving(false);
      }
    })();
  }, [
    targetLang,
    saving,
    tempTranslations,
    original.o_definition_id,
    original.type,
    getTransformedTranslations,
    id,
    history,
    nation_id,
    language_id,
    upsertTranslation,
    clearTempTranslation,
    getTranslationsQ,
  ]);

  const handleDetail = useCallback(() => {
    history.push(
      `/${nation_id}/${language_id}/1/maps/translate_word/${original.o_definition_id}/${original.type}`,
    );
  }, [language_id, nation_id, history, original]);

  const handleConfirm = useCallback(
    (translation: string, description: string) => {
      setTempTranslation(`${original.o_definition_id}:${original.type}`, {
        translation,
        description,
      });

      setSaving(true);
    },
    [setTempTranslation, original],
  );

  const handleCancel = useCallback(() => {
    clearTempTranslation(`${original.o_definition_id}:${original.type}`);
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
      text: word,
      description,
    };
  }, [data, loading, error]);

  return (
    <TranslatedTextItem
      original={{
        text: original.o_like_string,
        description: original.o_definition,
      }}
      translation={translation || undefined}
      onConfirm={(translation, description) => {
        handleConfirm(translation, description);
      }}
      onDetail={handleDetail}
      onCancel={handleCancel}
      saving={saving}
    />
  );
}
