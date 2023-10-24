import { ReactNode, useCallback, useState } from 'react';
import { IonIcon, IonInput } from '@ionic/react';
import { checkmark, pencil } from 'ionicons/icons';

import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
} from './styled';

import { VoteButtonsHorizontal } from '../VoteButtonsHorizontal';
import { Flag } from '../../flags/Flag';
import { FlagName } from '../../flags/flagGroups';
import { TableNameType } from '../../../generated/graphql';
import { Chat } from '../../chat/Chat';
import { PostAuthor } from '../PostAuthor';

type CardProps = {
  content?: string;
  contentIcon?: string;
  description?: ReactNode;
  voteFor?: 'content' | 'description';
  createdBy?: {
    username: string;
    isBot?: boolean;
    createdAt: string;
  };
  vote?: {
    upVotes: number;
    downVotes: number;
    onVoteUpClick: () => void;
    onVoteDownClick: () => void;
  };
  discussion?: {
    onChatClick: () => void;
    parent_table: string;
    parent_id: string;
  };
  flags?: {
    parent_table: TableNameType;
    parent_id: string;
    flag_names: FlagName[];
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
  flags,
  onContentEdit,
  createdBy,
}: CardProps) {
  const voteButtonCom = vote ? <VoteButtonsHorizontal {...vote} /> : null;
  const [editing, setEditing] = useState(false);
  const [newContentVal, setNewContentVal] = useState(content);

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

  const flagsCom = flags ? (
    <Flag
      parent_table={flags.parent_table}
      parent_id={flags.parent_id}
      flag_names={flags.flag_names}
    />
  ) : null;

  const discussionCom = discussion ? (
    <Chat
      parent_table={discussion.parent_table}
      parent_id={discussion.parent_id}
      onClick={discussion.onChatClick}
    />
  ) : null;

  // the chat icon should be grouped with the vote buttons
  const reactionCom = (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {voteButtonCom}
      {flagsCom}
      {discussionCom}
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
      <div style={{ margin: '10px' }}>
        {createdBy && createdBy.createdAt && (
          <PostAuthor
            date={new Date(createdBy.createdAt)}
            username={createdBy.username}
            isCreatedByBot={createdBy.isBot}
          />
        )}
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
      </div>
    </CustomCard>
  );
}
