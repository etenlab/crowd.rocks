import { ReactNode, useCallback, useState } from 'react';
import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
} from './styled';

import { VoteButtonsHerizontal } from '../VoteButtonsHerizontal';
import { chatbubbleEllipsesSharp, checkmark, pencil } from 'ionicons/icons';
import { StChatIcon } from '../styled';
import { IonIcon, IonInput } from '@ionic/react';

type CardProps = {
  content?: string;
  contentIcon?: string;
  description?: ReactNode;
  voteFor?: 'content' | 'description';
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  discussion?: {
    onChatClick: () => void;
  };
  onClick?: () => void;
  routerLink?: string;
  onContentEdit?: (newValue: string) => void;
};

export function Card({
  content,
  contentIcon,
  description,
  voteFor = 'content',
  onClick,
  routerLink,
  vote,
  discussion,
  onContentEdit,
}: CardProps) {
  const voteButtonCom = vote ? <VoteButtonsHerizontal {...vote} /> : null;
  const [editing, setEditing] = useState(false);
  const [newContentVal, setNewContentVal] = useState(content);

  // the chat icon should be grouped with the vote buttons
  const reactionCom = discussion ? (
    vote ? (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {voteButtonCom}
        <StChatIcon
          icon={chatbubbleEllipsesSharp}
          onClick={(e) => {
            e.stopPropagation();
            discussion.onChatClick && discussion.onChatClick();
          }}
        />
      </div>
    ) : (
      <StChatIcon
        icon={chatbubbleEllipsesSharp}
        onClick={(e) => {
          e.stopPropagation();
          discussion.onChatClick && discussion.onChatClick();
        }}
      />
    )
  ) : vote ? (
    voteButtonCom
  ) : null;

  const handleSave = useCallback(() => {
    setEditing(false);
    if (content != newContentVal && newContentVal != '')
      onContentEdit && onContentEdit(newContentVal!);
  }, [content, newContentVal, onContentEdit]);

  const editableContentComp = (
    <div>
      {editing ? (
        <IonInput
          value={content}
          fill="outline"
          onClick={(e) => e.stopPropagation()}
          onIonChange={(e) => {
            setNewContentVal(e.detail.value!);
          }}
        />
      ) : (
        content
      )}
    </div>
  );

  const editableIconComp = (
    <IonIcon
      icon={editing ? checkmark : pencil}
      onClick={(e) => {
        e.stopPropagation();
        editing ? handleSave() : setEditing(true);
      }}
    />
  );

  return (
    <CustomCard
      onClick={() => onClick && onClick()}
      routerLink={routerLink}
      style={{ cursor: onClick ? 'pointer' : 'unset' }}
    >
      {content ? (
        <CustomCardHeader>
          <CustomCardTitle>
            <div style={{ display: 'flex' }}>
              {contentIcon && (
                <IonIcon
                  icon={contentIcon}
                  style={{ paddingRight: '15px', marginTop: '2px' }}
                />
              )}
              {(!onContentEdit && content) || ''}
              {onContentEdit && editableContentComp}
            </div>
            {onContentEdit && editableIconComp}
            {voteFor === 'content' ? reactionCom : null}
          </CustomCardTitle>
        </CustomCardHeader>
      ) : null}

      {description ? (
        <CustomCardContent>
          {description}
          {voteFor === 'description' ? reactionCom : null}
        </CustomCardContent>
      ) : null}
    </CustomCard>
  );
}
