import { IonCheckbox } from '@ionic/react';
import { thumbsDown, thumbsUp } from 'ionicons/icons';

import { StButtonsDiv, StThumbDiv, StIonIcon } from './styled';

import { useToggleTranslationVoteStatusMutation } from '../../../hooks/useToggleTranslationVoteStatusMutation';

// import { useTr } from '../../../hooks/useTr';

type VerticalVoteButtonProps = {
  vote?: {
    translation_id: number;
    from_definition_type_is_word: boolean;
    to_definition_type_is_word: boolean;
    upvotes: number;
    downvotes: number;
  };
  onClick(): void;
  disabled: boolean;
  checked: boolean;
};

export function VerticalVoteButton({
  checked,
  disabled,
  vote,
  onClick,
}: VerticalVoteButtonProps) {
  const [toggleTranslationVoteStatus] =
    useToggleTranslationVoteStatusMutation();

  return (
    <StButtonsDiv>
      {vote ? (
        <StThumbDiv>
          <StIonIcon
            color="success"
            icon={thumbsUp}
            onClick={(e) => {
              e.stopPropagation();
              toggleTranslationVoteStatus({
                variables: {
                  translation_id: vote.translation_id + '',
                  vote: true,
                  from_definition_type_is_word:
                    vote.from_definition_type_is_word,
                  to_definition_type_is_word: vote.to_definition_type_is_word,
                },
              });
            }}
          />
          {vote.upvotes}
        </StThumbDiv>
      ) : null}

      <IonCheckbox
        checked={checked || !!vote}
        disabled={disabled || !!vote}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
      />

      {vote ? (
        <StThumbDiv>
          <StIonIcon
            color="danger"
            icon={thumbsDown}
            onClick={(e) => {
              e.stopPropagation();
              toggleTranslationVoteStatus({
                variables: {
                  translation_id: vote.translation_id + '',
                  vote: false,
                  from_definition_type_is_word:
                    vote.from_definition_type_is_word,
                  to_definition_type_is_word: vote.to_definition_type_is_word,
                },
              });
            }}
          />
          {vote.downvotes}
        </StThumbDiv>
      ) : null}
    </StButtonsDiv>
  );
}
