import {
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  IconButton,
  Button,
} from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { Item } from '../styled';

import { useTr } from '../../../hooks/useTr';
import { QuestionOnWordRange } from '../../../generated/graphql';

type QuestionsModalProps = {
  pieceOfText: string;
  questions: QuestionOnWordRange[];
  onSelectQuestion(question: QuestionOnWordRange): void;
  onClose(): void;
};

export function QuestionsModal({
  pieceOfText,
  questions,
  onSelectQuestion,
  onClose,
}: QuestionsModalProps) {
  const { tr } = useTr();

  const handleCancel = () => {
    onClose();
  };

  return (
    <Stack gap="24px">
      <Stack gap="18px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">{`${questions.length} ${tr(
            'Questions',
          )}`}</Typography>
          <IconButton onClick={handleCancel}>
            <Cancel sx={{ fontSize: 24 }} color="dark" />
          </IconButton>
        </Stack>
        <Divider />
        <Typography variant="h5">{`"${pieceOfText}"`}</Typography>
        <Typography variant="overline" color="text.gray">
          {tr('Help for the Translator:')}
        </Typography>
      </Stack>

      <List sx={{ padding: 0 }}>
        {questions.map((item) => (
          <ListItem key={item.question_id} disablePadding>
            <Item
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <Typography variant="body2">{item.question}</Typography>
              <Button
                variant="outlined"
                color="blue"
                onClick={() => {
                  onClose();
                  onSelectQuestion(item);
                }}
                fullWidth
                sx={{ padding: '5px 10px' }}
              >
                {tr('Reply now')}
              </Button>
            </Item>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
