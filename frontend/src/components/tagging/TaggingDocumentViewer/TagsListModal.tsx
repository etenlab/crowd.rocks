import { Stack, Typography, Divider, IconButton, Button } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { AddCircle } from '../../common/icons/AddCircle';

import { useTr } from '../../../hooks/useTr';

import { WordRangeTagWithVote } from '../../../generated/graphql';

import { TagItem } from './TagItem';

type TagsListModalProps = {
  pieceOfText: string;
  tags: WordRangeTagWithVote[];
  onClose(): void;
};

export function TagsListModal({
  pieceOfText,
  tags,
  onClose,
}: TagsListModalProps) {
  const { tr } = useTr();

  const handleCancel = () => {
    onClose();
  };

  return (
    <Stack gap="18px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Tags')}</Typography>
        <IconButton onClick={handleCancel}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
      <Divider />
      <Typography variant="h5">{`"${pieceOfText}"`}</Typography>
      <Typography variant="overline" color="text.gray">
        {tr('Tags')}
      </Typography>

      {tags.length > 0 ? (
        <Stack gap="16px">
          {tags.map((tag) => (
            <TagItem key={tag.word_range_tag_id} tag={tag} />
          ))}
        </Stack>
      ) : null}

      <Button
        variant="contained"
        color="blue"
        startIcon={<AddCircle sx={{ fontSize: 20 }} />}
        fullWidth
        onClick={onClose}
      >
        {tr('Cancel')}
      </Button>
    </Stack>
  );
}
