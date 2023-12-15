import { Button } from '@mui/material';

import { useUpsertPericopeMutation } from '../../../hooks/useUpsertPericopeMutation';
import { useTr } from '../../../hooks/useTr';
import { AddCircle } from '../../common/icons/AddCircle';

type PericopeAddButtonV2Props = {
  wordEntryId: string;
  onClose(): void;
};

export function PericopeAddButtonV2({
  wordEntryId,
  onClose,
}: PericopeAddButtonV2Props) {
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
    <Button
      variant="outlined"
      onClick={handleAddPericope}
      sx={{
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '6px',
      }}
      startIcon={<AddCircle sx={{ fontSize: 20 }} />}
      color="orange"
      fullWidth
    >
      {tr('Add Section')}
    </Button>
  );
}
