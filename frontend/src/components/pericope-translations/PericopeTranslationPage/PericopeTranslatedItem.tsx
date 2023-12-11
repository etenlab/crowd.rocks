import { Typography } from '@mui/material';
import { PericopeTextWithDescription } from '../../../generated/graphql';

type PericopeTranslatedItemProps = {
  pericopeTr: PericopeTextWithDescription;
};
export function PericopeTranslatedItem({
  pericopeTr,
}: PericopeTranslatedItemProps) {
  return (
    <Typography variant="h1" sx={{ paddingTop: '5px' }}>
      {pericopeTr.pericope_text}
    </Typography>
  );
}
