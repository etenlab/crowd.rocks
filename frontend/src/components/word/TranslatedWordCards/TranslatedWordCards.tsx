import { WordCard } from '../WordCard/WordCard';
import { langInfo2tag } from '../../../common/langUtils';
import { styled } from 'styled-components';

export type TWordTranslationCardProps = {
  wordTranslated: TWordTranslated;
  targetLang?: LanguageInfo;
};

export const TranslatedWordCards = ({
  wordTranslated,
  targetLang,
}: TWordTranslationCardProps) => {
  const routerLink = `/US/eng/1/maps/word-translations/${
    wordTranslated.word.id
  }/${langInfo2tag(targetLang)}`;

  return (
    <StCards>
      <StCard>
        <WordCard word={wordTranslated.word} routerLink={routerLink} />
      </StCard>
      <StCard>
        <WordCard word={wordTranslated.translation} routerLink={routerLink} />
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
