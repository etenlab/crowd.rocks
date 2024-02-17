import { Box, CircularProgress, Typography } from '@mui/material';
import { Check } from '../../common/icons/Check';

interface ProgressProps {
  percentValue: number;
}

export function ProgressCom({ percentValue }: ProgressProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={percentValue} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {percentValue < 100 ? (
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${percentValue}%`}</Typography>
        ) : (
          <Check />
        )}
      </Box>
    </Box>
  );
}
