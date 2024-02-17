import { ReactNode } from 'react';

import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';

export type Item = {
  title: string;
  onClick(): void;
  endIcon: ReactNode;
};

export type SettingListProps = {
  title: string;
  items: Item[];
};

export function SettingList({ title, items }: SettingListProps) {
  return (
    <Stack gap="20px" sx={{ width: '100%' }}>
      <Typography variant="h2">{title}</Typography>

      <List sx={{ padding: 0 }}>
        {items.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={item.onClick}
              sx={(theme) => ({
                borderRadius: '10px',
                border: `1px solid ${theme.palette.text.gray_stroke}`,
                marginBottom: '12px',
                padding: '10px 16px',
              })}
            >
              <Stack
                direction="row"
                alignContent="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {item.title}
                </Typography>
                {item.endIcon}
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
