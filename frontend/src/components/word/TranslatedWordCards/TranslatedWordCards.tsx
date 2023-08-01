import { WordTranslations, WordWithVotes } from '../../../generated/graphql';
import { useMapTranslationTools } from '../../map/hooks/useMapTranslationTools';
import { WordCard } from '../WordCard/WordCard';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordTranslated: WordTranslations;
  routerLink?: string;
  onClick?: () => void;
};

export const TranslatedWordCards = ({
  wordTranslated,
  routerLink,
  onClick,
}: TWordTranslationCardProps) => {
  const { chooseBestTranslation } = useMapTranslationTools();

  const wordBestTranslation = chooseBestTranslation(wordTranslated);

  return (
    <StCards>
      <StCard>
        <WordCard
          word={wordTranslated.word}
          definition={wordTranslated.definition}
          onClick={onClick}
          routerLink={routerLink}
        />
      </StCard>
      <StCard>
        <WordCard
          word={wordBestTranslation?.word || ''}
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
