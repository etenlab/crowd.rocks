import { Box } from '@mui/material';
type HrDashedProps = {
  colorStr?: string;
};

export function HrDashed({ colorStr = 'DEE0E8' }: HrDashedProps) {
  return (
    <Box
      sx={{
        marginTop: '10px',
        height: '1px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='1' viewBox='0 0 -100%25 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cline y1='0.5' x2='100%25' y2='0.5' stroke='%23${colorStr}' stroke-dasharray='7 7'/%3E%3C/svg%3E");`,
      }}
    />
  );
}
