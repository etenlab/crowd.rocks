import { MouseEventHandler } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { NavArrowRight } from '../icons/NavArrowRight';

import { Item } from './WordItemViewer';

export type WordItemStandardProps = {
  original: Item;
  translation?: Item;
  onDetail(): void;
  onClick(): void;
  disabledDetail?: boolean;
};

export function WordItemStandard({
  original,
  translation,
  disabledDetail,
  onDetail,
  onClick,
}: WordItemStandardProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onDetail();

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        position: 'relative',
        padding: '16px',
        border: `1px solid ${theme.palette.text.gray_stroke}`,
        borderRadius: '10px',
        background: 'default',
      })}
    >
      <Typography variant="h3">{original.word}</Typography>
      {translation ? (
        <Typography variant="body2" color="text.gray">
          {translation.word}
        </Typography>
      ) : null}

      <Typography
        variant="body2"
        color={translation ? 'text.dark' : 'text.gray'}
        sx={{
          fontWeight: translation ? 500 : 400,
          marginTop: translation ? '10px' : '0',
        }}
      >
        {original.description}
      </Typography>

      {translation ? (
        <Typography
          variant="body2"
          color="text.gray"
          sx={{
            marginTop: '10px',
          }}
        >
          {translation.description}
        </Typography>
      ) : null}

      <IconButton
        disabled={disabledDetail}
        onClick={handleClick}
        sx={(theme) => ({
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '4px',
          border: `1px solid ${theme.palette.text.gray_stroke}`,
          borderRadius: '50%',
          background: '#fff',
          color: theme.palette.text.gray,
        })}
      >
        <NavArrowRight sx={{ fontSize: 24 }} />
      </IconButton>
    </Box>
  );
}
