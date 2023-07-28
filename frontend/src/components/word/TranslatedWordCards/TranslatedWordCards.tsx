import { WordCard } from '../WordCard/WordCard';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordTranslated: TWordTranslated;
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
          routerLink={routerLink}
          onClick={onClick}
        />
      </StCard>
      <StCard>
        <WordCard
          word={wordTranslated.translation}
          routerLink={routerLink}
          onClick={onClick}
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
