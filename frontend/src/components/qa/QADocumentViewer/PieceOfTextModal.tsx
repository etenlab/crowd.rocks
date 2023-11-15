import {
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

import { QuestionOnWordRange } from '../../../generated/graphql';

type PieceOfTextModalProps = {
  questions: QuestionOnWordRange[];
  onSelectQuestion(question: QuestionOnWordRange): void;
  onClose(): void;
};

export function PieceOfTextModal({
  questions,
  onSelectQuestion,
  onClose,
}: PieceOfTextModalProps) {
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
        {questions.map((question) => (
          <ListItem key={question.question_id} disablePadding>
            <ListItemButton
              onClick={() => onSelectQuestion(question)}
              sx={(theme) => ({
                borderRadius: '10px',
                border: `1px solid ${theme.palette.text.gray_stroke}`,
                marginBottom: '16px',
                padding: '16px',
              })}
            >
              <Typography variant="body2">{question.question}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
