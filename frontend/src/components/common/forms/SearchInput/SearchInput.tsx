import { Box, IconButton, InputBase, Divider } from '@mui/material';
import { Search } from '../../icons/Search';

export type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange(value: string): void;
  onClickSearchButton(): void;
};

export function SearchInput({
  placeholder,
  value,
  onChange,
  onClickSearchButton,
}: SearchInputProps) {
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
      <IconButton sx={{ padding: 0 }} onClick={onClickSearchButton}>
        <Search sx={{ fontSize: 24 }} />
      </IconButton>
      <Divider
        orientation="vertical"
        variant="middle"
        sx={{ height: '24px', marginTop: 0, marginBottom: 0 }}
      />
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
        placeholder={placeholder}
      />
    </Box>
  );
}
