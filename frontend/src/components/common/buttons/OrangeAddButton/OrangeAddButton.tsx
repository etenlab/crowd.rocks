import { Stack, Typography } from '@mui/material';

import { AddCircle } from '../../../common/icons/AddCircle';

type OrangeAddButtonProps = {
  onClickAddButton(): void;
  label: string;
};

export function OrangeAddButton({
  onClickAddButton,
  label,
}: OrangeAddButtonProps) {
  return (
    <Stack
      onClick={onClickAddButton}
      gap="6px"
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: theme.palette.background.orange_light,
        color: theme.palette.text.orange,
      })}
      color="orange"
    >
      <AddCircle sx={{ fontSize: 20 }} />
      <Typography variant="h5" sx={{ fontWeight: 600 }} color="text.orange">
        {label}
      </Typography>
    </Stack>
  );
}
