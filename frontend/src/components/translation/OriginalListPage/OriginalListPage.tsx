import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  InputCustomEvent,
  InputChangeEventDetail,
  useIonRouter,
  useIonToast,
} from '@ionic/react';

import { Caption } from '../../common/Caption/Caption';

import { LangSelector } from '../../common/LangSelector/LangSelector';
import { WordOrPhraseList } from '../WordOrPhraseList';

import {} from '../../../generated/graphql';

import {} from '../../../generated/graphql';

import {} from '../../../generated/graphql';

import {
  CaptainContainer,
  FilterContainer,
  LanguageSelectorContainer,
} from './styled';
import { Input } from '../../common/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { PageLayout } from '../../common/PageLayout';

interface OriginalListPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function OriginalListPage({ match }: OriginalListPageProps) {
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

  const [filter, setFilter] = useState<string>('');

  const handleFilterChange = (
    event: InputCustomEvent<InputChangeEventDetail>,
  ) => {
    setFilter(event.detail.value!);
  };

  const handleClickDefinition = (
    definitionId: number,
    is_word_definition: boolean,
  ) => {
    if (!target) {
      present({
        message: `${tr('Please select a target language!')}`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });

      return;
    }
    router.push(
      `/${match.params.nation_id}/${
        match.params.language_id
      }/1/translation-list/${
        is_word_definition ? 'word' : 'phrase'
      }/${definitionId}`,
    );
  };

  return (
    <PageLayout>
      <CaptainContainer>
        <Caption>{tr('Translation')}</Caption>
      </CaptainContainer>

      <FilterContainer>
        <LanguageSelectorContainer>
          <LangSelector
            title={tr('Source language')}
            langSelectorId="translation-source-langSelector"
            selected={source as LanguageInfo | undefined}
            onChange={(_sourceLangTag, sourceLangInfo) => {
              changeTranslationSourceLanguage(sourceLangInfo);
            }}
            onClearClick={() => changeTranslationSourceLanguage(null)}
          />
          <LangSelector
            title={tr('Target language')}
            langSelectorId="translation-target-langSelector"
            selected={target as LanguageInfo | undefined}
            onChange={(_targetLangTag, targetLanguageInfo) => {
              changeTranslationTargetLanguage(targetLanguageInfo);
            }}
            onClearClick={() => changeTranslationTargetLanguage(null)}
          />
        </LanguageSelectorContainer>

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

      <WordOrPhraseList
        langInfo={source}
        filter={filter}
        onClickDefinition={handleClickDefinition}
      />
    </PageLayout>
  );
}
