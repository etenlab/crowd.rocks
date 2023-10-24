import { InputBase, Divider, Stack } from '@mui/material';

export type WordFormProps = {
  word: string;
  wordPlaceholder?: string;
  description: string;
  descriptionPlaceholder?: string;
  onChange(word: string, description: string): void;
  disabled?: boolean;
};

export function WordForm({
  word,
  wordPlaceholder,
  description,
  descriptionPlaceholder,
  onChange,
  disabled,
}: WordFormProps) {
  return (
    <Stack
      sx={(theme) => ({
        border: `1px solid ${theme.palette.text.gray_stroke}`,
        borderRadius: '10px',
      })}
    >
      <InputBase
        value={word}
        onChange={(e) => {
          onChange(e.currentTarget.value, description);
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
        placeholder={wordPlaceholder}
        disabled={disabled}
      />
      <Divider />
      <InputBase
        value={description}
        onChange={(e) => {
          onChange(word, e.currentTarget.value);
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
        placeholder={descriptionPlaceholder}
        disabled={disabled}
      />
    </Stack>
  );
}
