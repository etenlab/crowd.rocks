import { Stack, Typography } from '@mui/material';

import { useUpsertPericopeMutation } from '../../../hooks/useUpsertPericopeMutation';
import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';

type PericopeAddButtonProps = {
  wordEntryId: string;
  onClose(): void;
};

export function PericopeAddButton({
  wordEntryId,
  onClose,
}: PericopeAddButtonProps) {
  const { tr } = useTr();
  const [upsertPericope] = useUpsertPericopeMutation();

  const handleAddPericope = () => {
    upsertPericope({
      variables: {
        startWord: wordEntryId,
      },
    });
    onClose();
  };
  return (
    <Stack
      onClick={handleAddPericope}
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
        {tr('Add Pericope')}
      </Typography>
    </Stack>
  );
}
