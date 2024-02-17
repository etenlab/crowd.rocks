import { Box, Typography } from '@mui/material';
import {
  PericopeTextWithDescription,
  PericopeTranslationWithVotes,
} from '../../../generated/graphql';
import { HrDashed } from '../../common/HrDashed/HrDashed';

type PericopeTranslatedItemProps = {
  pericopeText: PericopeTextWithDescription;
  pericopeTrWithVotes?: PericopeTranslationWithVotes;
};
export function PericopeTranslated({
  pericopeText,
  pericopeTrWithVotes,
}: PericopeTranslatedItemProps) {
  return (
    <Box
      sx={() => ({
        position: 'relative',
        background: 'default',
      })}
    >
      <Typography variant="h3" color={'text.dark'}>
        {pericopeText.pericope_text}
      </Typography>

      {pericopeTrWithVotes ? (
        <Typography
          variant="body2"
          color="text.gray"
          sx={{
            marginTop: '10px',
          }}
        >
          {pericopeTrWithVotes.translation}
        </Typography>
      ) : null}
      <HrDashed />

      <Typography
        variant="h4"
        color={'text.dark'}
        sx={{
          fontWeight: 500,
          marginTop: '10px',
        }}
      >
        {pericopeText.pericope_description_text}
      </Typography>

      {pericopeTrWithVotes ? (
        <Typography
          variant="body2"
          color="text.gray"
          sx={{
            marginTop: '10px',
          }}
        >
          {pericopeTrWithVotes.translation_description}
        </Typography>
      ) : null}
    </Box>
  );
}
