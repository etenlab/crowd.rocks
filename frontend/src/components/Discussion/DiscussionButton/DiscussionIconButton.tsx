import { MouseEventHandler } from 'react';
import { useHistory, useParams } from 'react-router';

import { Badge, Button } from '@mui/material';

import { ChatLines } from '../../common/icons/ChatLines';

import { useGetTotalPostsQuery } from '../../../generated/graphql';

type DiscussionIconButtonProps = {
  parent_table: string;
  parent_id: string;
  onClick?: () => void;
};

export function DiscussionIconButton({
  parent_id,
  parent_table,
  onClick,
}: DiscussionIconButtonProps) {
  const history = useHistory();
  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
  }>();

  const { data: postCountData } = useGetTotalPostsQuery({
    variables: { parent_id: parent_id, parent_name: parent_table },
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick && onClick();
    history.push(
      `/${nation_id}/${language_id}/1/discussion/${parent_table}/${parent_id}`,
    );

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Badge badgeContent={postCountData?.getTotalPosts.total || 0} color="green">
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ padding: '4px', minWidth: '22px', borderRadius: '50%' }}
        color="blue"
      >
        <ChatLines sx={{ fontSize: 24 }} />
      </Button>
    </Badge>
  );
}
