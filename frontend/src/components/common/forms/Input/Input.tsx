import { Box, InputBase } from '@mui/material';

export type InputProps = {
  placeholder: string;
  value: string;
  onChange(value: string): void;
  multiline?: boolean;
  rows?: number;
};

export function Input({ placeholder, value, onChange, ...props }: InputProps) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.text.gray_stroke}`,
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
        }}
        {...props}
        placeholder={placeholder}
      />
    </Box>
  );
}
