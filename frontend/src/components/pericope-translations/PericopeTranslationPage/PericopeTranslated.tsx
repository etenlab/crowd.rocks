import { Box, Typography } from '@mui/material';
import {
  PericopeTextWithDescription,
  PericopeTranslationWithVotes,
} from '../../../generated/graphql';

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
      <Box
        sx={{
          marginTop: '10px',
          height: '1px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='1' viewBox='0 0 -100%25 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cline y1='0.5' x2='100%25' y2='0.5' stroke='%23DEE0E8' stroke-dasharray='7 7'/%3E%3C/svg%3E");`,
        }}
      />

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
