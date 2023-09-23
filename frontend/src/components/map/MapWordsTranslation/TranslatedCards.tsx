import {
  MapWordOrPhrase,
  useGetRecommendedTranslationFromDefinitionIdQuery,
} from '../../../generated/graphql';
// import { useMapTranslationTools } from '../../map/hooks/useMapTranslationTools';
import { WordOrPhraseCard } from '../WordOrPhraseCard';
import { styled } from 'styled-components';
import { TableNameType } from '../../../generated/graphql';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';
import { useAppContext } from '../../../hooks/useAppContext';

export type TWordTranslationCardProps = {
  wordOrPhrase: MapWordOrPhrase;
  routerLink?: string;
  onClick?: () => void;
};

export const TranslatedCards = ({
  wordOrPhrase,
  routerLink,
  onClick,
}: TWordTranslationCardProps) => {
  // const { chooseBestTranslation } = useMapTranslationTools();
  // const wordBestTranslation = chooseBestTranslation(wordOrPhrase.);
  const {
    states: {
      global: {
        langauges: { targetLang },
      },
    },
  } = useAppContext();

  const translation = useGetRecommendedTranslationFromDefinitionIdQuery({
    variables: {
      from_definition_id: wordOrPhrase.o_definition_id,
      from_type_is_word: wordOrPhrase.type === 'word',
      language_code: targetLang?.lang.tag || '',
      dialect_code: targetLang?.dialect?.tag,
      geo_code: targetLang?.region?.tag,
    },
  });

  const translationType =
    translation.data?.getRecommendedTranslationFromDefinitionID
      .translation_with_vote?.__typename;

  let tValue: string | undefined;
  let tDefinition: string | undefined;
  if (
    translationType === 'PhraseToPhraseTranslationWithVote' ||
    translationType === 'WordToPhraseTranslationWithVote'
  ) {
    tValue =
      translation.data?.getRecommendedTranslationFromDefinitionID
        .translation_with_vote?.to_phrase_definition.phrase.phrase;
    tDefinition =
      translation.data?.getRecommendedTranslationFromDefinitionID
        .translation_with_vote?.to_phrase_definition.definition;
  }
  if (
    translationType === 'PhraseToWordTranslationWithVote' ||
    translationType === 'WordToWordTranslationWithVote'
  ) {
    tValue =
      translation.data?.getRecommendedTranslationFromDefinitionID
        .translation_with_vote?.to_word_definition.word.word;
    tDefinition =
      translation.data?.getRecommendedTranslationFromDefinitionID
        .translation_with_vote?.to_word_definition.definition;
  }

  return (
    <StCards>
      <StCard>
        <WordOrPhraseCard
          value={wordOrPhrase.o_like_string}
          definition={wordOrPhrase.o_definition}
          onClick={onClick}
          routerLink={routerLink}
          flags={{
            parent_table:
              wordOrPhrase.type === 'word'
                ? TableNameType.WordDefinitions
                : TableNameType.Phrases,
            parent_id: wordOrPhrase.o_id,
            flag_names: WORD_AND_PHRASE_FLAGS,
          }}
        />
      </StCard>
      <StCard>
        <WordOrPhraseCard
          value={tValue}
          definition={tDefinition}
          onClick={onClick}
          routerLink={routerLink}
        />
      </StCard>
    </StCards>
  );
};

const StCards = styled.div`
  display: flex;
  flex-direction: row;
`;

const StCard = styled.div`
  width: 50%;
  & > * {
    cursor: pointer;
  }
`;
