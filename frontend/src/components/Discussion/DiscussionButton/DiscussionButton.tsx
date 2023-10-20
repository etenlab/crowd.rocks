import { MouseEventHandler } from 'react';
import { useHistory, useParams } from 'react-router';

import { Button } from '@mui/material';

import { ChatLines } from '../../common/icons/ChatLines';

import { useGetTotalPostsQuery } from '../../../generated/graphql';

type DiscussionButtonProps = {
  parent_table: string;
  parent_id: string;
  label: string;
  onClick?: () => void;
};

export function DiscussionButton({
  parent_id,
  parent_table,
  label,
  onClick,
}: DiscussionButtonProps) {
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
      variant="outlined"
      onClick={handleClick}
      color="blue"
      startIcon={<ChatLines sx={{ fontSize: 24 }} />}
    >
      {label}
      {postCountData?.getTotalPosts.total
        ? ` (${postCountData?.getTotalPosts.total})`
        : ''}
    </Button>
  );
}
