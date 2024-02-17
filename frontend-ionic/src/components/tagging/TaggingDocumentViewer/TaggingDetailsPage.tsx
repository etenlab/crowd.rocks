import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { Stack, Box, Typography, Button } from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { TagAddingModal } from './TagAddingModal';
import { TagItem } from './TagItem';

import {
  ErrorType,
  WordRangeTagWithVote,
  useGetDocumentTextFromRangesLazyQuery,
  useGetWordRangeTagsByWordRangeIdsLazyQuery,
} from '../../../generated/graphql';

export function TaggingDetailsPage() {
  const { tr } = useTr();
  const {
    actions: { createModal },
  } = useAppContext();
  const { openModal, closeModal } = createModal();

  const { word_range_id } = useParams<{ word_range_id: string }>();

  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();
  const [getWordRangeTagsByWordRangeIds, { data }] =
    useGetWordRangeTagsByWordRangeIdsLazyQuery();

  useEffect(() => {
    if (word_range_id) {
      getWordRangeTagsByWordRangeIds({
        variables: {
          word_range_ids: [word_range_id],
        },
      });
    }
  }, [getWordRangeTagsByWordRangeIds, word_range_id]);

  useEffect(() => {
    if (
      !data ||
      data.getWordRangeTagsByWordRangeIds.error !== ErrorType.NoError
    ) {
      return;
    }

    const firstTag = data.getWordRangeTagsByWordRangeIds.word_range_tags[0];

    if (firstTag) {
      getDocumentTextFromRanges({
        variables: {
          ranges: [
            {
              begin_document_word_entry_id:
                firstTag.word_range.begin.document_word_entry_id,
              end_document_word_entry_id:
                firstTag.word_range.end.document_word_entry_id,
            },
          ],
        },
      });
    }
  }, [data, getDocumentTextFromRanges]);

  const tags = useMemo(() => {
    if (
      !data ||
      data.getWordRangeTagsByWordRangeIds.error !== ErrorType.NoError
    ) {
      return [];
    }

    return data.getWordRangeTagsByWordRangeIds.word_range_tags
      .filter((item): item is WordRangeTagWithVote => !!item)
      .filter((item) => item.word_range.word_range_id === word_range_id);
  }, [data, word_range_id]);

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
  };

  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

  return (
    <PageLayout>
      <Caption>{tr('Tagging Tool')}</Caption>

      <Stack
        gap="14px"
        sx={{
          padding: '20px 16px',
          marginLeft: '-16px',
          marginRight: '-16px',
          backgroundColor: (theme) => theme.palette.background.gray_bg,
        }}
      >
        <Typography variant="h3">{pieceOfText}:</Typography>
        <Stack
          direction="row"
          gap="14px"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            flex: 1,
            flexWrap: 'wrap',
            backgroundColor: (theme) => theme.palette.background.gray_bg,
          }}
        >
          {tags.map((tag) => (
            <Box
              sx={(theme) => ({
                border: `1px solid ${theme.palette.background.gray_stroke}`,
                borderRadius: '6px',
                padding: '6px 12px',
                color: theme.palette.background.gray,
                fontWeight: 500,
              })}
              key={tag.tag_name}
            >
              {tag.tag_name}
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack gap="24px">
        <Typography variant="h3">{tr('All Tags')}</Typography>
        <Button
          variant="contained"
          color="blue"
          startIcon={<AddCircle sx={{ fontSize: 20 }} />}
          fullWidth
          onClick={handleAddNewTags}
        >
          {tr('Add New Tag')}
        </Button>

        {tags.length > 0 ? (
          <Stack gap="16px">
            {tags.map((tag) => (
              <TagItem
                key={tag.word_range_tag_id}
                tag={tag}
                onClose={() => {}}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </PageLayout>
  );
  // }
}
