import { styled } from '@mui/material';

const Span = styled('span')({});

export function BpIcon({ color }: { color: string }) {
  return (
    <Span
      sx={{
        borderRadius: '6px !important',
        width: 22,
        height: 22,
        boxShadow: `inset 0 0 0 2px ${color}, inset 0 -2px 0 ${color}`,
        backgroundColor: (theme) => theme.palette.background.white,
      }}
    />
  );
}

export function BpCheckedIcon({ color }: { color: string }) {
  const Checked = styled(Span)({
    backgroundColor: color,
    borderRadius: '6px !important',
    '&:before': {
      display: 'block',
      width: 22,
      height: 22,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  });

  return <Checked color={color} />;
}
