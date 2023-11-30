import { Stack, Typography, Divider, IconButton, Button } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { AddCircle } from '../../common/icons/AddCircle';

import { useTr } from '../../../hooks/useTr';

import {
  ErrorType,
  WordRangeTagWithVote,
  useGetWordRangeTagsByBeginWordEntryIdQuery,
} from '../../../generated/graphql';

import { TagItem } from './TagItem';
import { useAppContext } from '../../../hooks/useAppContext';
import { TagAddingModal } from './TagAddingModal';
import { useMemo } from 'react';

type TagsListModalProps = {
  pieceOfText: string;
  begin_document_word_entry_id: string;
  end_document_word_entry_id: string;
  onClose(): void;
};

export function TagsListModal({
  pieceOfText,
  begin_document_word_entry_id,
  end_document_word_entry_id,
  onClose,
}: TagsListModalProps) {
  const { tr } = useTr();
  const {
    actions: { createModal },
  } = useAppContext();
  const { openModal, closeModal } = createModal();

  const { data } = useGetWordRangeTagsByBeginWordEntryIdQuery({
    variables: {
      begin_document_word_entry_id,
    },
  });

  const tags = useMemo(() => {
    if (
      !data ||
      data.getWordRangeTagsByBeginWordEntryId.error !== ErrorType.NoError
    ) {
      return [];
    }

    return data.getWordRangeTagsByBeginWordEntryId.word_range_tags
      .filter((item): item is WordRangeTagWithVote => !!item)
      .filter(
        (item) =>
          item.word_range.end.document_word_entry_id ===
          end_document_word_entry_id,
      );
  }, [data, end_document_word_entry_id]);

  const handleCancel = () => {
    onClose();
  };

  const handleAddNewTags = () => {
    openModal(
      <TagAddingModal
        begin_document_word_entry_id={
          tags[0].word_range.begin.document_word_entry_id
        }
        end_document_word_entry_id={
          tags[0].word_range.end.document_word_entry_id
        }
        onClose={closeModal}
      />,
    );
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
            <TagItem
              key={tag.word_range_tag_id}
              tag={tag}
              onClose={handleCancel}
            />
          ))}
        </Stack>
      ) : null}

      <Button
        variant="contained"
        color="blue"
        startIcon={<AddCircle sx={{ fontSize: 20 }} />}
        fullWidth
        onClick={handleAddNewTags}
      >
        {tr('Add New Tag')}
      </Button>
    </Stack>
  );
}
