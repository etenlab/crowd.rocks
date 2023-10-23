import { Stack, Typography, Divider, Button, IconButton } from '@mui/material';

import { useTr } from '../../../hooks/useTr';

import { Cancel } from '../../common/icons/Cancel';

type MapNavigationModalProps = {
  onClose(): void;
  setQuickFilter: (quickFilterValue: string | null) => void;
};

export function MapNavigationModal({
  onClose,
  setQuickFilter,
}: MapNavigationModalProps) {
  const { tr } = useTr();

  const handleCancel = () => {
    onClose();
  };

  const chars = [...new Array(26)]
    .map((_, index) => index)
    .map((num) => String.fromCharCode('A'.charCodeAt(0) + num));

  return (
    <Stack gap="24px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Go to')}...</Typography>
        <IconButton onClick={handleCancel}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
      <Divider />
      <Stack
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          setQuickFilter(null);
          onClose();
        }}
        direction="row"
        alignItems="ceter"
        width="fit-content"
      >
        <Cancel sx={{ color: (theme) => theme.palette.text.red }} />
        <Typography
          alignSelf="center"
          marginLeft={'2px'}
          sx={{ color: (theme) => theme.palette.text.red }}
        >
          {tr('Clear Filter')}
        </Typography>
      </Stack>
      <Stack direction="row" gap="10px" flexWrap="wrap">
        {chars.map((item) => (
          <Button
            key={item}
            variant="contained"
            color="gray_bg"
            sx={{
              padding: '7px',
              minWidth: '37px',
              border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
            }}
            onClick={() => {
              setQuickFilter(item);
              onClose();
            }}
          >
            {item}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
