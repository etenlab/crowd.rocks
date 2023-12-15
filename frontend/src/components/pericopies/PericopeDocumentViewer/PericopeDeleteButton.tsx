import { Stack, Typography } from '@mui/material';

import { useDeletePericopeMutation } from '../../../hooks/useDeletePericopeMutation';
import { useTr } from '../../../hooks/useTr';
import { DeleteCircle } from '../../common/icons/DeleteCircle';

type PericopeDeleteButtonProps = {
  pericopeId: string;
  onClose(): void;
};

export function PericopeDeleteButton({
  pericopeId,
  onClose,
}: PericopeDeleteButtonProps) {
  const { tr } = useTr();
  const [deletePericope] = useDeletePericopeMutation();

  const handleDeletePericope = () => {
    deletePericope({
      variables: {
        pericope_id: pericopeId,
      },
    });
    onClose();
  };
  return (
    <Stack
      onClick={handleDeletePericope}
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
      <DeleteCircle sx={{ fontSize: 20 }} />
      <Typography variant="h5" sx={{ fontWeight: 600 }} color="text.orange">
        {tr('Delete Section')}
      </Typography>
    </Stack>
  );
}
