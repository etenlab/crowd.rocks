import { Box } from '@mui/material';
import { PericopeTextWithTranslation } from '../../../generated/graphql';

type TPericopeItemParams = {
  pericopeTextWithTranslation: PericopeTextWithTranslation;
};

export function PericopeTrItem({
  pericopeTextWithTranslation,
}: TPericopeItemParams) {
  return <Box>{JSON.stringify(pericopeTextWithTranslation)}</Box>;
}
