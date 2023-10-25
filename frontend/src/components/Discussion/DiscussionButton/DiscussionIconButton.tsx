import { MouseEventHandler } from 'react';
import { useHistory, useParams } from 'react-router';

import { Button } from '@mui/material';

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
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        padding: `4px ${postCountData?.getTotalPosts.total ? '10px' : ''}`,
        minWidth: '22px',
        fontSize: '13px',
        gap: '4px',
      }}
      color="blue"
    >
      <ChatLines sx={{ fontSize: 20 }} />
      {postCountData?.getTotalPosts.total || ''}
    </Button>
  );
}
