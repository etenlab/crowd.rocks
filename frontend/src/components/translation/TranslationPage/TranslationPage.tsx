import { useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  InputCustomEvent,
  InputChangeEventDetail,
  useIonToast,
  useIonRouter,
} from '@ionic/react';
import { Stack } from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { globals } from '../../../services/globals';

import { LangSelector } from '../../common/LangSelector/LangSelector';
import { OriginalWordOrPhraseList } from '../OriginalWordOrPhraseList';
import { TranslationWordOrPhraseList } from '../TranslationWordOrPhraseList';

import {
  Input,
  FilterContainer,
  FullWidthContainer,
  LanguageSelectorContainer,
} from '../../common/styled';

import { ListContainer } from '../styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useUpsertTranslationMutation } from '../../../hooks/useUpsertTranslationMutation';

interface TranslationPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function TranslationPage({ match }: TranslationPageProps) {
  const { tr } = useTr();
  const router = useIonRouter();
  const [present] = useIonToast();

  const {
    states: {
      global: {
        langauges: {
          translationPage: { source, target },
        },
      },
    },
    actions: {
      changeTranslationSourceLanguage,
      changeTranslationTargetLanguage,
    },
  } = useAppContext();

  const [originalFilter, setOriginalFilter] = useState<string>('');
  const [translationFilter, setTranslationFilter] = useState<string>('');
  // const [renderFlag, setRenderFlag] = useState<boolean>(false);

  const [originalDefinition, setOriginalDefinition] = useState<{
    definitionId: number;
    is_word_definition: boolean;
  }>();
  const [translationDefinitions, setTranslationDefinitions] = useState<
    {
      definitionId: number;
      is_word_definition: boolean;
    }[]
  >([]);

  const [upsertTranslation] = useUpsertTranslationMutation();

  const handleOriginalFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setOriginalFilter(event.detail.value!);
    setOriginalDefinition(undefined);
    setTranslationDefinitions([]);
  };

  const handleTranslationFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setTranslationFilter(event.detail.value!);
    setTranslationDefinitions([]);
  };

  const handleChangeOriginalDefinition = useCallback(
    (definitionId: number, is_word_definition: boolean) => {
      if (!target) {
        present({
          message: `${tr('Please select a target language!')}`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      setOriginalDefinition({
        definitionId,
        is_word_definition,
      });

      setTranslationDefinitions([]);
    },
    [present, target, tr],
  );

  const handleToggleSelectedValue = useCallback(
    (definitionId: number, is_word_definition: boolean) => {
      setTranslationDefinitions((translationDefinitions) => {
        const translation = translationDefinitions.find(
          (definition) =>
            definition.definitionId === definitionId &&
            definition.is_word_definition === is_word_definition,
        );

        if (translation) {
          return translationDefinitions.filter(
            (definition) =>
              !(
                definition.definitionId === definitionId &&
                definition.is_word_definition === is_word_definition
              ),
          );
        } else {
          return [
            ...translationDefinitions,
            {
              definitionId,
              is_word_definition,
            },
          ];
        }
      });
    },
    [],
  );

  const handleSaveTranslations = () => {
    if (!originalDefinition) {
      return;
    }

    for (const translationDefinition of translationDefinitions) {
      upsertTranslation({
        variables: {
          from_definition_id: originalDefinition.definitionId + '',
          from_definition_type_is_word: originalDefinition.is_word_definition,
          to_definition_id: translationDefinition.definitionId + '',
          to_definition_type_is_word: translationDefinition.is_word_definition,
        },
      });
    }
  };

  const handleGoToGoogleTranslate = () => {
    router.push(
      `/${match.params.nation_id}/${match.params.language_id}/1/google-translate`,
    );
  };

  const userId = globals.get_user_id();
  const isAdmin = userId ? userId === 1 : false;

  return (
    <PageLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Caption>{tr('Translation')}</Caption>
        {isAdmin ? (
          <IonButton onClick={handleGoToGoogleTranslate}>
            {tr('Use Google Translate')}
          </IonButton>
        ) : null}
      </Stack>

      <FilterContainer>
        <LanguageSelectorContainer>
          <FullWidthContainer>
            <LangSelector
              title={tr('Source language')}
              selected={source as LanguageInfo}
              onChange={(_sourceLangTag, sourceLangInfo) => {
                changeTranslationSourceLanguage(sourceLangInfo);
              }}
              onClearClick={() => changeTranslationSourceLanguage(null)}
            />
            <Input
              type="text"
              label={tr('Search')}
              labelPlacement="floating"
              fill="outline"
              debounce={300}
              value={originalFilter}
              onIonInput={handleOriginalFilterChange}
            />
          </FullWidthContainer>

          <FullWidthContainer>
            <LangSelector
              title={tr('Target language')}
              selected={target as LanguageInfo}
              onChange={(_targetLangTag, targetLanguageInfo) => {
                changeTranslationTargetLanguage(targetLanguageInfo);
              }}
              onClearClick={() => changeTranslationTargetLanguage(null)}
            />
            <Input
              type="text"
              label={tr('Search')}
              labelPlacement="floating"
              fill="outline"
              debounce={300}
              value={translationFilter}
              onIonInput={handleTranslationFilterChange}
            />
          </FullWidthContainer>
        </LanguageSelectorContainer>
      </FilterContainer>

      <ListContainer>
        <OriginalWordOrPhraseList
          filter={originalFilter}
          langInfo={source}
          selectedValue={
            originalDefinition
              ? `${originalDefinition.is_word_definition ? 'word' : 'phrase'}_${
                  originalDefinition.definitionId
                }`
              : undefined
          }
          onChangeOriginalDefinition={handleChangeOriginalDefinition}
        />
        <TranslationWordOrPhraseList
          filter={translationFilter}
          langInfo={target}
          originalDefinition={originalDefinition}
          selectedValues={translationDefinitions}
          onToggleSelectedValue={handleToggleSelectedValue}
        />
      </ListContainer>

      <IonButton
        disabled={
          translationDefinitions.length === 0 ||
          originalDefinition === undefined
        }
        onClick={handleSaveTranslations}
      >
        {tr('Submit')}
      </IonButton>
    </PageLayout>
  );
}
