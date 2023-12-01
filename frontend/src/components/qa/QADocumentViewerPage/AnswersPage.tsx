import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { Divider, Stack, Typography, Button } from '@mui/material';

import { PostAuthor } from '../../common/PostAuthor';
import { Caption } from '../../common/Caption/Caption';

import { PageLayout } from '../../common/PageLayout';

import { Item } from '../styled';
import { AnswerForm } from './AnswerForm';

import { useTr } from '../../../hooks/useTr';
import { globals } from '../../../services/globals';

import {
  useGetAnswerByUserIdLazyQuery,
  useGetDocumentTextFromRangesLazyQuery,
  useGetQuestionStatisticQuery,
  useReadWordRangeLazyQuery,
} from '../../../generated/graphql';
import { useSubscribeToAnswersAddedSubscription } from '../../../hooks/useUpsertAnswerMutation';

import { AnswerList } from './AnswerList';
import { Statistics } from './Statistics';
import { Tabs } from '../../common/buttons/Tabs';

export function AnswersPage() {
  const { tr } = useTr();
  const { question_id } = useParams<{ question_id: string }>();

  const { data: statisticData } = useGetQuestionStatisticQuery({
    variables: {
      question_id,
    },
  });
  const [getAnswerByUserId, { data: myAnswerData }] =
    useGetAnswerByUserIdLazyQuery();
  useSubscribeToAnswersAddedSubscription();

  const [readWordRange, { data: wordRangeData }] = useReadWordRangeLazyQuery();
  const [getDocumentTextFromRange, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  const [currentTab, setCurrentTab] = useState<'Answers' | 'Statistics'>(
    'Answers',
  );
  const [showAnswerForm, setShowAnswerForm] = useState<boolean>(false);

  const tabs = [
    {
      label: tr('Answers'),
      value: 'Answers',
    },
    {
      label: tr('Statistics'),
      value: 'Statistics',
    },
  ];

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

  const questionWithStatistic =
    statisticData?.getQuestionStatistic.question_with_statistic || null;
  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

  useEffect(() => {
    const user_id = globals.get_user_id();

    if (user_id && questionWithStatistic) {
      getAnswerByUserId({
        variables: {
          user_id: user_id + '',
          question_id: questionWithStatistic.question_id,
        },
      });
    }
  }, [getAnswerByUserId, questionWithStatistic]);

  const handleCloseAnswerForm = () => {
    setShowAnswerForm(false);
  };

  const handleOpenAnswerForm = () => {
    setShowAnswerForm(true);
  };

  const myAnswer = useMemo(() => {
    if (!myAnswerData) {
      return null;
    }

    if (myAnswerData.getAnswerByUserId.answers.length === 0) {
      return null;
    }

    return myAnswerData.getAnswerByUserId.answers[0];
  }, [myAnswerData]);

  const answerFormCom =
    showAnswerForm && questionWithStatistic ? (
      <AnswerForm
        question={questionWithStatistic}
        onClose={handleCloseAnswerForm}
        initialItems={myAnswer?.question_items || []}
      />
    ) : (
      <Button variant="contained" color="blue" onClick={handleOpenAnswerForm}>
        {myAnswer ? tr('Update Answer') : tr('Add Answer')}
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
            <Tabs
              tabs={tabs}
              selected={currentTab}
              onChange={(tab) => setCurrentTab(tab as 'Answers' | 'Statistics')}
              disabled={
                !questionWithStatistic ||
                questionWithStatistic.question_items.length === 0
                  ? ['Statistics']
                  : []
              }
            />
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
