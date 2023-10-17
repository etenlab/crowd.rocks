import { Fragment, useState } from 'react';
import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  Button,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';

import { useTr } from '../../../../hooks/useTr';

import { OptionItem } from './Select';

export type SelectModalProps = {
  options: OptionItem[];
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClose(): void;
};

export function SelectModal({
  options,
  value,
  onChange,
  onClose,
}: SelectModalProps) {
  const matches = useMediaQuery('(min-width:765px)');
  const { tr } = useTr();

  const [selected, setSelected] = useState<OptionItem | null>(value);

  const handleChange = () => {
    onChange(selected);
    onClose();
  };

  return (
    <Stack width="100%">
      <Stack
        gap="5px"
        sx={(theme) => ({
          padding: '18px',
          borderBottom: '1px solid #DEE0E8',
          maxWidth: '777px',
          width: '100%',
          margin: 'auto',
          backgroundColor: theme.palette.text.white,
        })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button onClick={onClose} color="red">
            {tr('Cancel')}
          </Button>
          <Button onClick={handleChange}>{tr('Confirm')}</Button>
        </Stack>
      </Stack>
      <List sx={{ padding: 0 }}>
        <Virtuoso
          style={{
            height: matches ? 'calc(600px - 200px)' : 'calc(100vh - 170px)',
          }}
          data={options}
          itemContent={(_index, item) => (
            <Fragment key={item.value as string}>
              <ListItem
                secondaryAction={
                  <Radio edge="end" checked={item.value === selected?.value} />
                }
                disablePadding
              >
                <ListItemButton onClick={() => setSelected(item)}>
                  <ListItemText
                    primary={
                      <Typography variant="body1">{item.label}</Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </Fragment>
          )}
        />
      </List>
    </Stack>
  );
}
