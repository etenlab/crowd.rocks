import { Typography, Stack, Box, Divider } from '@mui/material';

export type Item = {
  text: string;
  description: string;
};

export type TranslatedTextItemViewerProps = {
  original: Item;
  viewData: Item;
};

export function TranslatedTextItemViewer({
  original,
  viewData,
}: TranslatedTextItemViewerProps) {
  return (
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
          {original.text}
        </Typography>
        <Typography variant="body2" color="text.white">
          {original.description}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.palette.text.gray_stroke}`,
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
        })}
      >
        <Typography variant="h3" sx={{ padding: '12px 16px' }}>
          {viewData.text}
        </Typography>
        <Divider />
        <Typography variant="body1" sx={{ padding: '12px 16px' }}>
          {viewData.description}
        </Typography>
      </Box>
    </Stack>
  );
}
