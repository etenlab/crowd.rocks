import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import { Stack, Typography, Divider, IconButton } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import {
  ErrorType,
  useGetQuestionOnWordRangesByBeginWordEntryIdLazyQuery,
  useGetDocumentTextFromRangesLazyQuery,
} from '../../../generated/graphql';
import { NavArrowRight } from '../../common/icons/NavArrowRight';

type PieceOfTextListProps = {
  begin_document_word_entry_id: string;
};

export function PieceOfTextList({
  begin_document_word_entry_id,
}: PieceOfTextListProps) {
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const { tr } = useTr();

  const [getQuestionOnWordRangesByBeginWordEntryId, { data }] =
    useGetQuestionOnWordRangesByBeginWordEntryIdLazyQuery();
  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  const rangeMapRef = useRef(
    new Map<
      string,
      {
        word_range_id: string;
        begin_document_word_entry_id: string;
        end_document_word_entry_id: string;
      }
    >(),
  );

  useEffect(() => {
    if (begin_document_word_entry_id) {
      getQuestionOnWordRangesByBeginWordEntryId({
        variables: {
          begin_document_word_entry_id,
        },
      });
    }
  }, [begin_document_word_entry_id, getQuestionOnWordRangesByBeginWordEntryId]);

  useEffect(() => {
    if (
      !data ||
      data.getQuestionOnWordRangesByBeginWordEntryId.error !== ErrorType.NoError
    ) {
      return;
    }

    rangeMapRef.current = new Map<
      string,
      {
        word_range_id: string;
        begin_document_word_entry_id: string;
        end_document_word_entry_id: string;
      }
    >();

    data.getQuestionOnWordRangesByBeginWordEntryId.questions.forEach(
      (question) => {
        if (question) {
          rangeMapRef.current.set(
            `${question.begin.document_word_entry_id}-${question.end.document_word_entry_id}`,
            {
              word_range_id: question.parent_id,
              begin_document_word_entry_id:
                question.begin.document_word_entry_id,
              end_document_word_entry_id: question.end.document_word_entry_id,
            },
          );
        }
      },
    );

    const inputs: {
      begin_document_word_entry_id: string;
      end_document_word_entry_id: string;
    }[] = [];

    for (const value of rangeMapRef.current.values()) {
      inputs.push({
        begin_document_word_entry_id: value.begin_document_word_entry_id,
        end_document_word_entry_id: value.end_document_word_entry_id,
      });
    }

    getDocumentTextFromRanges({
      variables: {
        ranges: inputs,
      },
    });
  }, [getDocumentTextFromRanges, data]);

  const handleSelectPiece = (
    begin_document_word_entry_id: string,
    end_document_word_entry_id: string,
  ) => {
    const key = `${begin_document_word_entry_id}-${end_document_word_entry_id}`;

    const item = rangeMapRef.current.get(key);

    if (item) {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/question-details/${item.word_range_id}`,
      );
    }
  };

  const pieceOfTexts = useMemo(() => {
    if (!textFromRangeData) {
      return [];
    }

    const obj: Record<
      string,
      { pieceOfText: string; beginWordEntryId: string; endWordEntryId: string }
    > = {};

    textFromRangeData.getDocumentTextFromRanges.list.forEach((item) => {
      obj[
        `${item.begin_document_word_entry_id}-${item.end_document_word_entry_id}`
      ] = {
        pieceOfText: item.piece_of_text,
        beginWordEntryId: item.begin_document_word_entry_id,
        endWordEntryId: item.end_document_word_entry_id,
      };
    });

    return Object.values(obj);
  }, [textFromRangeData]);

  if (pieceOfTexts.length === 0) {
    return null;
  }
  return (
    <Stack gap="16px">
      <Typography
        variant="overline"
        color="text.gray"
        sx={{ textOverflow: 'hidden' }}
      >
        {tr('Select piece of text')}:
      </Typography>

      {pieceOfTexts.map((item) => (
        <Fragment key={item.pieceOfText}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap="16px"
          >
            <Typography variant="h4" sx={{ flex: 1 }}>
              {item.pieceOfText}
            </Typography>
            <IconButton
              onClick={() =>
                handleSelectPiece(item.beginWordEntryId, item.endWordEntryId)
              }
            >
              <NavArrowRight sx={{ fontSize: 24 }} />
            </IconButton>
          </Stack>
          <Divider />
        </Fragment>
      ))}
    </Stack>
  );
}
