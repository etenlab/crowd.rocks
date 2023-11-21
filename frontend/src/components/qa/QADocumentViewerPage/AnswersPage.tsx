import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { PostAuthor } from '../../common/PostAuthor';
import { Caption } from '../../common/Caption/Caption';

import { PageLayout } from '../../common/PageLayout';

import { Item } from '../styled';
import { AnswerForm } from './AnswerForm';

import { useTr } from '../../../hooks/useTr';

import {
  useGetDocumentTextFromRangesLazyQuery,
  useGetQuestionStatisticQuery,
  useReadWordRangeLazyQuery,
} from '../../../generated/graphql';
import { AnswerList } from './AnswerList';
import { Statistics } from './Statistics';

export function AnswersPage() {
  const { tr } = useTr();
  const { question_id } = useParams<{ question_id: string }>();

  const { data: statisticData } = useGetQuestionStatisticQuery({
    variables: {
      question_id,
    },
  });
  const [readWordRange, { data: wordRangeData }] = useReadWordRangeLazyQuery();
  const [getDocumentTextFromRange, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  const [currentTab, setCurrentTab] = useState<'Answers' | 'Statistics'>(
    'Answers',
  );
  const [showAnswerForm, setShowAnswerForm] = useState<boolean>(false);

  useEffect(() => {
    if (statisticData) {
      readWordRange({
        variables: {
          id: statisticData.getQuestionStatistic.question_with_statistic
            .parent_id,
        },
      });
    }
  }, [readWordRange, statisticData]);

  useEffect(() => {
    if (wordRangeData) {
      const wordRange = wordRangeData.readWordRanges.word_ranges[0];

      if (wordRange) {
        getDocumentTextFromRange({
          variables: {
            ranges: [
              {
                begin_document_word_entry_id:
                  wordRange.begin.document_word_entry_id,
                end_document_word_entry_id:
                  wordRange.end.document_word_entry_id,
              },
            ],
          },
        });
      }
    }
  }, [getDocumentTextFromRange, wordRangeData]);

  const handleCloseAnswerForm = () => {
    setShowAnswerForm(false);
  };

  const handleOpenAnswerForm = () => {
    setShowAnswerForm(true);
  };

  const questionWithStatistic =
    statisticData?.getQuestionStatistic.question_with_statistic || null;
  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

  const answerFormCom =
    showAnswerForm && questionWithStatistic ? (
      <AnswerForm
        question={questionWithStatistic}
        onClose={handleCloseAnswerForm}
      />
    ) : (
      <Button variant="contained" color="blue" onClick={handleOpenAnswerForm}>
        {tr('Add Answer')}
      </Button>
    );

  return (
    <PageLayout>
      <Caption>{tr('Answers')}</Caption>
      <Typography variant="h4">{`"${pieceOfText}"`}</Typography>

      <Divider />

      {questionWithStatistic ? (
        <Stack gap="10px">
          <Typography variant="overline" color="text.gray">
            {tr('Question by')}:
          </Typography>

          <PostAuthor
            username={questionWithStatistic.created_by_user.avatar}
            date={new Date(questionWithStatistic.created_at)}
            avatar={questionWithStatistic.created_by_user.avatar_url || ''}
          />
          <Item>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {questionWithStatistic.question}
            </Typography>
          </Item>
        </Stack>
      ) : null}

      <Stack gap="24px">
        <Stack gap="24px">
          {!showAnswerForm ? (
            <Stack direction="row">
              <Button
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: '10px 0 0 10px',
                  borderRight: currentTab === 'Answers' ? '' : 'none',
                  backgroundColor:
                    currentTab === 'Answers'
                      ? theme.palette.background.blue_10
                      : '',
                })}
                color={currentTab === 'Answers' ? 'blue' : 'gray'}
                onClick={() => setCurrentTab('Answers')}
                fullWidth
              >
                {tr('Answers')}
              </Button>
              <Button
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: '0 10px 10px 0',
                  borderLeft: currentTab === 'Statistics' ? '' : 'none',
                  backgroundColor:
                    currentTab === 'Statistics'
                      ? theme.palette.background.blue_10
                      : '',
                })}
                color={currentTab === 'Statistics' ? 'blue' : 'gray'}
                onClick={() => setCurrentTab('Statistics')}
                fullWidth
                disabled={
                  !questionWithStatistic ||
                  questionWithStatistic.question_items.length === 0
                    ? true
                    : false
                }
              >
                {tr('Statistics')}
              </Button>
            </Stack>
          ) : null}

          {answerFormCom}

          {!showAnswerForm && questionWithStatistic ? (
            currentTab === 'Answers' ? (
              <AnswerList question={questionWithStatistic} />
            ) : (
              <Statistics question={questionWithStatistic} />
            )
          ) : null}
        </Stack>
      </Stack>
    </PageLayout>
  );
}
