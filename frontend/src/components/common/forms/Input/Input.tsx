import { Box, InputBase, Divider, IconButton } from '@mui/material';

import { Cancel } from '../../icons/Cancel';

export type InputProps = {
  placeholder: string;
  value: string;
  onChange(value: string): void;
  multiline?: boolean;
  rows?: number;
  onClear?(): void;
  error?: boolean;
};

export function Input({
  placeholder,
  value,
  onChange,
  onClear,
  error,
  ...props
}: InputProps) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '10px',
        border: `1px solid ${
          error ? theme.palette.text.red : theme.palette.text.gray_stroke
        }`,
        gap: '12px',
      })}
    >
      <InputBase
        value={value}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        sx={{
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '22px',
          letterSpacing: '-0.28px',
          '& input': {
            padding: 0,
          },
          flex: 1,
          color: (theme) =>
            error ? theme.palette.text.red : theme.palette.text.dark,
        }}
        {...props}
        placeholder={placeholder}
      />
      {onClear ? (
        <>
          <Divider
            orientation="vertical"
            variant="middle"
            sx={{ height: '16px', marginTop: 0, marginBottom: 0 }}
          />
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => {
              onChange('');
              onClear();
            }}
          >
            <Cancel sx={{ fontSize: 22 }} color="red" />
          </IconButton>
        </>
      ) : null}
    </Box>
  );
}
