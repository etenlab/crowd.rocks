import { useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router';

import { Stack, Typography, Divider, IconButton, Box } from '@mui/material';

import {
  ErrorType,
  WordRangeTagWithVote,
  useGetWordRangeTagsByBeginWordEntryIdLazyQuery,
  useGetDocumentTextFromRangesLazyQuery,
} from '../../../generated/graphql';

import { NavArrowRight } from '../../common/icons/NavArrowRight';

type TagPreviewerListProps = {
  begin_document_word_entry_id?: string;
};

export function TagPreviewerList({
  begin_document_word_entry_id,
}: TagPreviewerListProps) {
  const history = useHistory();

  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
  }>();

  const [getWordRangeTagsbyBeginWordEntryId, { data }] =
    useGetWordRangeTagsByBeginWordEntryIdLazyQuery();
  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  useEffect(() => {
    if (begin_document_word_entry_id) {
      getWordRangeTagsbyBeginWordEntryId({
        variables: {
          begin_document_word_entry_id,
        },
      });
    }
  }, [begin_document_word_entry_id, getWordRangeTagsbyBeginWordEntryId]);

  useEffect(() => {
    if (
      !data ||
      data.getWordRangeTagsByBeginWordEntryId.error !== ErrorType.NoError
    ) {
      return;
    }

    const rangeMap = new Map<
      string,
      {
        begin_document_word_entry_id: string;
        end_document_word_entry_id: string;
      }
    >();

    data.getWordRangeTagsByBeginWordEntryId.word_range_tags.forEach((item) => {
      if (item) {
        rangeMap.set(
          `${item.word_range.begin.document_word_entry_id}-${item.word_range.end.document_word_entry_id}`,
          {
            begin_document_word_entry_id:
              item.word_range.begin.document_word_entry_id,
            end_document_word_entry_id:
              item.word_range.end.document_word_entry_id,
          },
        );
      }
    });

    const inputs: {
      begin_document_word_entry_id: string;
      end_document_word_entry_id: string;
    }[] = [];

    for (const value of rangeMap.values()) {
      inputs.push(value);
    }

    getDocumentTextFromRanges({
      variables: {
        ranges: inputs,
      },
    });
  }, [getDocumentTextFromRanges, data]);

  const tagsGroup = useMemo(() => {
    if (
      !data ||
      data.getWordRangeTagsByBeginWordEntryId.error !== ErrorType.NoError ||
      !textFromRangeData ||
      textFromRangeData.getDocumentTextFromRanges.error !== ErrorType.NoError
    ) {
      return [];
    }

    const textsMap = new Map<string, string>();

    textFromRangeData.getDocumentTextFromRanges.list.forEach((item) => {
      textsMap.set(
        `${item.begin_document_word_entry_id}-${item.end_document_word_entry_id}`,
        item.piece_of_text,
      );
    });

    const tagsMap = new Map<string, WordRangeTagWithVote[]>();

    data.getWordRangeTagsByBeginWordEntryId.word_range_tags.forEach((item) => {
      if (!item) {
        return;
      }

      const arr = tagsMap.get(item.word_range.word_range_id);

      if (arr) {
        arr.push(item);
      } else {
        tagsMap.set(item.word_range.word_range_id, [item]);
      }
    });

    const tempGroup: {
      word_range_id: string;
      piece_of_text: string;
      tag_names: string[];
    }[] = [];

    for (const value of tagsMap.values()) {
      if (value.length > 0) {
        const word_range_id = value[0].word_range.word_range_id;
        const piece_of_text =
          textsMap.get(
            `${value[0].word_range.begin.document_word_entry_id}-${value[0].word_range.end.document_word_entry_id}`,
          ) || '';

        tempGroup.push({
          word_range_id,
          piece_of_text,
          tag_names: value.map((item) => item.tag_name),
        });
      }
    }

    return tempGroup;
  }, [data, textFromRangeData]);

  const handleGoToDetail = (word_range_id: string) => {
    history.push(
      `/${nation_id}/${language_id}/1/tagging-tool/details/${word_range_id}`,
    );
  };

  return (
    <Stack gap="16px">
      {tagsGroup.map((tag) => (
        <>
          <Stack
            key={tag.word_range_id}
            gap="16px"
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack
              direction="row"
              gap="16px"
              alignItems="center"
              justifyContent="flex-start"
              sx={{ flex: 1, flexWrap: 'wrap', paddingTop: '5px' }}
            >
              <Typography variant="h4">{tag.piece_of_text}:</Typography>
              {tag.tag_names.map((tag_name) => (
                <Box
                  sx={(theme) => ({
                    border: `1px solid ${theme.palette.background.gray_stroke}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: theme.palette.background.gray,
                    fontWeight: 500,
                  })}
                  key={tag_name}
                >
                  {tag_name}
                </Box>
              ))}
            </Stack>
            <IconButton onClick={() => handleGoToDetail(tag.word_range_id)}>
              <NavArrowRight sx={{ fontSize: 24 }} />
            </IconButton>
          </Stack>
          <Divider />
        </>
      ))}
    </Stack>
  );
}
