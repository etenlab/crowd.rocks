import { Stack, Typography, Divider, Button, IconButton } from '@mui/material';

import { useTr } from '../../../hooks/useTr';

import { Cancel } from '../../common/icons/Cancel';
import { GroupedFilterSymbols } from '../../../../../utils';

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

  const digits = GroupedFilterSymbols.Digits;

  const specialSymbols = GroupedFilterSymbols.SpecialCharacters;

  return (
    <Stack gap="24px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Go to')}...</Typography>
        <IconButton onClick={handleCancel}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
      <Divider />
      <Button
        variant="text"
        onClick={() => {
          setQuickFilter(null);
          onClose();
        }}
        startIcon={<Cancel sx={{ fontSize: 24 }} />}
        color="red"
        sx={{
          padding: 0,
          margin: 0,
          justifyContent: 'flex-start',
          fontSize: '13px',
          '& .MuiButton-startIcon': {
            margin: 0,
          },
        }}
      >
        {tr('Clear Filter')}
      </Button>
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
      <Stack direction="row" gap="10px" width="100%">
        <Button
          fullWidth
          variant="contained"
          color="gray_bg"
          sx={{
            padding: '7px',
            minWidth: '37px',
            border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
          }}
          onClick={() => {
            setQuickFilter(digits);
            onClose();
          }}
        >
          {digits}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="gray_bg"
          sx={{
            padding: '7px',
            minWidth: '37px',
            border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
          }}
          onClick={() => {
            setQuickFilter(specialSymbols);
            onClose();
          }}
        >
          {specialSymbols}
        </Button>
      </Stack>
    </Stack>
  );
}
