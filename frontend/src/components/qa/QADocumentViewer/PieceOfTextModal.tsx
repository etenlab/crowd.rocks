import { useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  IconButton,
} from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { useTr } from '../../../hooks/useTr';
import {
  WordRangeInput,
  useGetDocumentTextFromRangesLazyQuery,
} from '../../../generated/graphql';

type Range = {
  begin_document_word_entry_id: string;
  end_document_word_entry_id: string;
};

type PieceOfTextModalProps = {
  ranges: Range[];
  onSelectPiece(
    pieceOfText: string,
    begin_document_word_entry_id: string,
    end_document_word_entry_id: string,
  ): void;
  onClose(): void;
};

export function PieceOfTextModal({
  ranges,
  onSelectPiece,
  onClose,
}: PieceOfTextModalProps) {
  const { tr } = useTr();
  const [getDocumentTextFromRange, { data, loading }] =
    useGetDocumentTextFromRangesLazyQuery();

  useEffect(() => {
    const pieceOfTextsMap = new Map<string, boolean>();

    for (const range of ranges) {
      const begin = range.begin_document_word_entry_id;
      const end = range.end_document_word_entry_id;
      const key = JSON.stringify({
        begin,
        end,
      });

      pieceOfTextsMap.set(key, true);
    }

    const input: WordRangeInput[] = [];

    for (const key of pieceOfTextsMap.keys()) {
      input.push({
        begin_document_word_entry_id: JSON.parse(key).begin,
        end_document_word_entry_id: JSON.parse(key).end,
      });
    }

    getDocumentTextFromRange({
      variables: {
        ranges: input,
      },
    });
  }, [getDocumentTextFromRange, ranges]);

  const pieceOfTexts = useMemo(() => {
    if (!data || loading) {
      return [];
    }

    return data.getDocumentTextFromRanges.list.map((item) => ({
      pieceOfText: item.piece_of_text,
      beginWordEntryId: item.begin_document_word_entry_id,
      endWordEntryId: item.end_document_word_entry_id,
    }));
  }, [data, loading]);

  const handleCancel = () => {
    onClose();
  };

  return (
    <Stack gap="24px">
      <Box style={{ textAlign: 'center' }}>
        {loading && <CircularProgress />}
      </Box>

      <Stack gap="18px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">{tr('Piece of text')}</Typography>
          <IconButton onClick={handleCancel}>
            <Cancel sx={{ fontSize: 24 }} color="dark" />
          </IconButton>
        </Stack>
        <Divider />
        <Typography variant="overline" color="text.gray">
          {tr('Select a piece of text:')}
        </Typography>
      </Stack>

      <List sx={{ padding: 0 }}>
        {pieceOfTexts.map((item) => (
          <ListItem key={item.pieceOfText} disablePadding>
            <ListItemButton
              onClick={() => {
                onClose();
                onSelectPiece(
                  item.pieceOfText,
                  item.beginWordEntryId,
                  item.endWordEntryId,
                );
              }}
              sx={(theme) => ({
                borderRadius: '10px',
                border: `1px solid ${theme.palette.text.gray_stroke}`,
                marginBottom: '16px',
                padding: '16px',
              })}
            >
              <Typography variant="body2">{item.pieceOfText}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
