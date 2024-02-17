import React from 'react';

import { Typography } from '@mui/material';

/**
 * Primary UI for Date format, ex: Today at 7:54 AM or 12/01/2022 4:54 PM
 */
export function DateViewer({ date }: { date: Date }) {
  const todayDate = new Date().toLocaleDateString();

  let dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  if (dateString === todayDate) {
    dateString = 'Today at';
  }

  const transformedDate = `${dateString} ${timeString}`;

  return (
    <Typography
      variant="body2"
      color="text.gray"
      sx={{
        fontWeight: 300,
        lineHeight: '15px',
        opacity: 0.5,
      }}
    >
      {transformedDate}
    </Typography>
  );
}
