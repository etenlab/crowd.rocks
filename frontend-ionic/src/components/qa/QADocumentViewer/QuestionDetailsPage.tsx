import { useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router';
import { Stack, Typography, Button, Divider } from '@mui/material';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { AddCircle } from '../../common/icons/AddCircle';
import { PostAuthor } from '../../common/PostAuthor';
import { Item } from '../styled';

import { useTr } from '../../../hooks/useTr';

import {
  ErrorType,
  QuestionOnWordRange,
  useGetDocumentTextFromRangesLazyQuery,
  useGetQuestionOnWordRangesByWordRangeIdLazyQuery,
} from '../../../generated/graphql';
import { useSubscribeToQuestionsOnWordRangeAddedSubscription } from '../../../hooks/useCreateQuestionOnWordRangeMutation';

export function QuestionDetailsPage() {
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const { tr } = useTr();

  const { word_range_id } = useParams<{
    word_range_id: string;
  }>();

  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();
  const [getQuestionOnWordRangesByWordRangeId, { data }] =
    useGetQuestionOnWordRangesByWordRangeIdLazyQuery();

  useSubscribeToQuestionsOnWordRangeAddedSubscription();

  useEffect(() => {
    if (word_range_id) {
      getQuestionOnWordRangesByWordRangeId({
        variables: {
          word_range_id: word_range_id,
        },
      });
    }
  }, [getQuestionOnWordRangesByWordRangeId, word_range_id]);

  useEffect(() => {
    if (
      !data ||
      data.getQuestionOnWordRangesByWordRangeId.error !== ErrorType.NoError
    ) {
      return;
    }

    const firstQuestion =
      data.getQuestionOnWordRangesByWordRangeId.questions[0];

    if (firstQuestion) {
      getDocumentTextFromRanges({
        variables: {
          ranges: [
            {
              begin_document_word_entry_id:
                firstQuestion.begin.document_word_entry_id,
              end_document_word_entry_id:
                firstQuestion.end.document_word_entry_id,
            },
          ],
        },
      });
    }
  }, [data, getDocumentTextFromRanges]);

  const questions = useMemo(() => {
    if (
      !data ||
      data.getQuestionOnWordRangesByWordRangeId.error !== ErrorType.NoError
    ) {
      return [];
    }

    return data.getQuestionOnWordRangesByWordRangeId.questions
      .filter((item): item is QuestionOnWordRange => !!item)
      .filter((item) => item.parent_id === word_range_id);
  }, [data, word_range_id]);

  const handleAddNewQuestion = () => {
    if (questions[0]) {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/new-question/${questions[0].begin.document_word_entry_id}/${questions[0].end.document_word_entry_id}`,
      );
    }
  };

  const handleSelectQuestion = (question_id: string) => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/qa/answers/${question_id}`,
    );
  };

  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

  return (
    <PageLayout>
      <Caption>{tr('Details')}</Caption>

      <Typography variant="h3">{`"${pieceOfText}"`}</Typography>

      <Divider />

      <Stack gap="24px">
        <Typography variant="h3">{`${questions.length} ${tr(
          'Questions',
        )}:`}</Typography>
        <Button
          variant="contained"
          color="blue"
          startIcon={<AddCircle sx={{ fontSize: 20 }} />}
          fullWidth
          onClick={handleAddNewQuestion}
        >
          {tr('Add a New Question')}
        </Button>

        {questions.map((question) => (
          <Stack gap="10px" key={question.question_id}>
            <PostAuthor
              username={question.created_by_user.avatar}
              date={new Date(question.created_at)}
              avatar={question.created_by_user.avatar_url || ''}
            />
            <Item
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <Typography variant="h4">{question.question}</Typography>
              <Button
                variant="outlined"
                color="blue"
                onClick={() => handleSelectQuestion(question.question_id)}
                fullWidth
                sx={{ padding: '5px 10px' }}
              >
                {tr('Reply now')}
              </Button>
            </Item>
          </Stack>
        ))}
      </Stack>
    </PageLayout>
  );
  // }
}
