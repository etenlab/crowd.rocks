import { WordTranslations } from '../../../generated/graphql';
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
          word={wordTranslated?.translations?.[0]?.word || ''}
          definition={wordTranslated?.translations?.[0]?.definition || ''}
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
`;
