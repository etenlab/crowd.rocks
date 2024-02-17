import { useState } from 'react';
import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';

import { CheckCircle } from '../../icons/CheckCircle';
import { Radio } from '../../buttons/Radio';

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
    <Stack gap="20px" sx={{ width: '100%', padding: '0 20px 30px' }}>
      <Typography variant="h2">{tr('Select')}</Typography>

      <List sx={{ padding: 0 }}>
        <Virtuoso
          style={{
            height: matches ? 'calc(700px - 170px)' : 'calc(100vh - 170px)',
          }}
          data={options}
          components={{
            Footer: () => {
              return options.length === 0 ? (
                <Typography variant="body1">{tr('No results')}...</Typography>
              ) : null;
            },
          }}
          itemContent={(_index, item) => (
            <ListItem key={item.value as string} disablePadding>
              <ListItemButton
                onClick={() => setSelected(item)}
                sx={(theme) => ({
                  borderRadius: '10px',
                  border: `1px solid ${
                    item.value === selected?.value
                      ? theme.palette.text.blue
                      : theme.palette.text.gray_stroke
                  }`,
                  marginBottom: '10px',
                  padding: '15px 14px',
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
                    gap="9px"
                  >
                    <Radio
                      color={
                        item.value === selected?.value ? 'blue' : 'gray_stroke'
                      }
                      checked={item.value === selected?.value}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 400 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Stack>
              </ListItemButton>
            </ListItem>
          )}
        />
      </List>

      <Stack
        gap="18px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="gray_stroke"
          sx={{
            flex: 1,
            boxShadow: `0px 12px 14px 0px rgba(12, 29, 87, 0.20)`,
          }}
        >
          {tr('Cancel')}
        </Button>
        <Button
          onClick={handleChange}
          variant="contained"
          color="blue"
          sx={{
            flex: 1,
            boxShadow: `0px 12px 14px 0px rgba(12, 29, 87, 0.20)`,
          }}
          startIcon={<CheckCircle sx={{ fontSize: 24 }} />}
        >
          {tr('Confirm')}
        </Button>
      </Stack>
    </Stack>
  );
}
