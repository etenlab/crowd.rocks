import { MapWordOrPhrase } from '../../../generated/graphql';
// import { useMapTranslationTools } from '../../map/hooks/useMapTranslationTools';
import { WordOrPhraseCard } from '../WordCard/WordOrPhraseCard';
import { styled } from 'styled-components';
import { TableNameType } from '../../../generated/graphql';

import { WORD_AND_PHRASE_FLAGS } from '../../flags/flagGroups';

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
        {/* <WordOrPhraseCard
          value={textTranslated}
          definition={wordBestTranslation?.definition || ''}
          onClick={onClick}
          routerLink={routerLink}
        /> */}
        <>tr here</>
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
