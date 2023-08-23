import {
  MapPhraseTranslations,
  WordTranslations,
} from '../../../generated/graphql';
import { useMapTranslationTools } from '../../map/hooks/useMapTranslationTools';
import { WordOrPhraseCard } from '../WordCard/WordOrPhraseCard';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordTranslated: WordTranslations | MapPhraseTranslations;
  routerLink?: string;
  onClick?: () => void;
};

export const TranslatedCards = ({
  wordTranslated,
  routerLink,
  onClick,
}: TWordTranslationCardProps) => {
  const { chooseBestTranslation } = useMapTranslationTools();

  const wordBestTranslation = chooseBestTranslation(wordTranslated);

  let textOriginal = '';
  let textTranslated = '';
  if ('word' in wordTranslated) {
    textOriginal = wordTranslated.word;
  } else if ('phrase' in wordTranslated) {
    textOriginal = wordTranslated.phrase;
  }
  if ('word' in wordBestTranslation) {
    textTranslated = wordBestTranslation.word;
  } else if ('phrase' in wordBestTranslation) {
    textTranslated = wordBestTranslation.phrase;
  }

  return (
    <StCards>
      <StCard>
        <WordOrPhraseCard
          word={textOriginal}
          definition={wordTranslated.definition}
          onClick={onClick}
          routerLink={routerLink}
        />
      </StCard>
      <StCard>
        <WordOrPhraseCard
          word={textTranslated}
          definition={wordBestTranslation?.definition || ''}
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
