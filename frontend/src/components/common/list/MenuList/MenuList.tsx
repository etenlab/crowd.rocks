import { ReactNode } from 'react';

import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';

import { useTr } from '../../../../hooks/useTr';

export type Item = {
  title: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick(): void;
};

export type MenuListProps = {
  items: Item[];
};

export function MenuList({ items }: MenuListProps) {
  const { tr } = useTr();

  return (
    <Stack gap="30px" sx={{ width: '100%', padding: '20px 16px' }}>
      <Typography variant="h2">{tr('Menu')}</Typography>

      <List sx={{ padding: 0 }}>
        {items.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={item.onClick}
              sx={(theme) => ({
                borderRadius: '6px',
                border: `1px solid ${theme.palette.text.gray_stroke}`,
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: theme.palette.background.gray_bg,
              })}
            >
              <Stack
                direction="row"
                alignContent="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  alignContent="center"
                  justifyContent="flex-start"
                  gap="10px"
                >
                  {item.startIcon}
                  <Typography variant="h4" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Stack>
                {item.endIcon}
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
