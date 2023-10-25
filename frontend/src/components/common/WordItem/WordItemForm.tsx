import { useState } from 'react';
import {
  Typography,
  Stack,
  Box,
  Divider,
  Button,
  InputBase,
  useTheme,
  CircularProgress,
} from '@mui/material';

import { CheckCircle } from '../icons/CheckCircle';

import { useTr } from '../../../hooks/useTr';

import { Item } from './WordItemViewer';

export type WordItemFormProps = {
  saving?: boolean;
  original: Item;
  initialFormData: Item;
  onConfirm(translation: string, description: string): void;
  onCancel(): void;
};

export function WordItemForm({
  saving,
  original,
  initialFormData,
  onConfirm,
  onCancel,
}: WordItemFormProps) {
  const { tr } = useTr();
  const theme = useTheme();

  const [translation, setTranslation] = useState<string>(initialFormData.word);
  const [description, setDescription] = useState<string>(
    initialFormData.description,
  );

  const handleClick = () => {
    if (translation.trim() !== '' && description.trim() !== '') {
      onConfirm(translation.trim(), description.trim());
    }
  };

  return (
    <Stack gap="16px">
      <Stack>
        <Box
          sx={(theme) => ({
            padding: '16px',
            border: `1px solid ${theme.palette.text.blue}`,
            borderRadius: '10px 10px 0 0',
            background: theme.palette.text.blue,
          })}
        >
          <Typography variant="h3" color="text.white">
            {original.word}
          </Typography>
          <Typography variant="body2" color="text.white">
            {original.description}
          </Typography>
        </Box>

        <Box
          sx={{
            border: `1px solid ${theme.palette.text.gray_stroke}`,
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
          }}
        >
          <InputBase
            value={translation}
            onChange={(e) => {
              setTranslation(e.currentTarget.value);
            }}
            multiline
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              letterSpacing: '-0.28px',
              padding: '12px 16px',
              width: '100%',
              '& input': {
                padding: 0,
              },
            }}
            placeholder={tr('Your translation')}
            disabled={saving}
          />
          <Divider />
          <InputBase
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
            }}
            multiline
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              letterSpacing: '-0.28px',
              padding: '12px 16px',
              width: '100%',
              '& input': {
                padding: 0,
              },
            }}
            placeholder={tr('Description')}
            disabled={saving}
          />
        </Box>
      </Stack>

      {translation.trim() === '' || description.trim() === '' ? (
        <Button
          variant="contained"
          color="gray_stroke"
          disabled={saving}
          onClick={onCancel}
        >
          {tr('Cancel')}
        </Button>
      ) : (
        <Stack
          gap="24px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            fullWidth
            variant="contained"
            color="gray_stroke"
            onClick={onCancel}
            disabled={saving}
          >
            {tr('Cancel')}
          </Button>
          <Button
            variant="contained"
            color="green"
            startIcon={
              saving ? (
                <CircularProgress size="18px" color="inherit" />
              ) : (
                <CheckCircle sx={{ fontSize: 24 }} />
              )
            }
            onClick={handleClick}
            disabled={
              saving || translation.trim() === '' || description.trim() === ''
            }
            fullWidth
          >
            {tr('Save')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
