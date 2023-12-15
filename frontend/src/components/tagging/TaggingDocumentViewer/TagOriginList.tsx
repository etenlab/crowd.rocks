import { useEffect } from 'react';
import { Stack, Button, Typography } from '@mui/material';
import { Cancel } from '../../common/icons/Cancel';

import { useGetDocumentTextFromRangesLazyQuery } from '../../../generated/graphql';

type TagOriginListProps = {
  selectedWordRanges: {
    begin: string;
    end: string;
  }[];
  onCancel(wordRange: { begin: string; end: string }): void;
};

export function TagOriginList({
  selectedWordRanges,
  onCancel,
}: TagOriginListProps) {
  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  useEffect(() => {
    getDocumentTextFromRanges({
      variables: {
        ranges: selectedWordRanges.map((item) => ({
          begin_document_word_entry_id: item.begin,
          end_document_word_entry_id: item.end,
        })),
      },
    });
  }, [selectedWordRanges, getDocumentTextFromRanges]);

  return (
    <Stack gap="10px" direction="row" sx={{ flexWrap: 'wrap' }}>
      {textFromRangeData?.getDocumentTextFromRanges.list.map((range) => (
        <Button
          key={`${range.begin_document_word_entry_id} - ${range.end_document_word_entry_id}`}
          variant="outlined"
          color="gray"
          onClick={() =>
            onCancel({
              begin: range.begin_document_word_entry_id,
              end: range.end_document_word_entry_id,
            })
          }
          endIcon={<Cancel sx={{ fontSize: 20 }} />}
        >
          <Typography variant="h5">{range.piece_of_text}</Typography>
        </Button>
      ))}
    </Stack>
  );
}
