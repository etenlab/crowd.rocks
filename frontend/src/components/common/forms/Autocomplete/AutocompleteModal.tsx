import { useCallback, useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useDebounce } from 'use-debounce';

import {
  Typography,
  Stack,
  Button,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery,
} from '@mui/material';

import { useTr } from '../../../../hooks/useTr';
import { SearchInput } from '../SearchInput';
import { Radio } from '../../buttons/Radio';

import { OptionItem } from './Autocomplete';
import { CheckCircle } from '../../icons/CheckCircle';

export type AutocompleteModalProps = {
  options: OptionItem[];
  searchPlaceholder?: string;
  label?: string;
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClose(): void;
};

export function AutocompleteModal({
  options,
  label,
  searchPlaceholder,
  value,
  onChange,
  onClose,
}: AutocompleteModalProps) {
  const { tr } = useTr();
  const matches = useMediaQuery('(min-width:765px)');

  const [selected, setSelected] = useState<OptionItem | null>(value);
  const [filter, setFilter] = useState<string>('');
  const [bouncedFilter] = useDebounce(filter, 500);

  const handleChange = useCallback(() => {
    setTimeout(() => onChange(selected), 0);
    onClose();
  }, [onChange, selected, onClose]);

  const sortedOptions = useMemo(
    () =>
      options.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        } else if (a.label < b.label) {
          return -1;
        } else {
          return 0;
        }
      }),
    [options],
  );

  const filteredOptions = useMemo(
    () =>
      sortedOptions.filter((item) => {
        return item.label
          .toLowerCase()
          .includes(bouncedFilter.toLocaleLowerCase());
      }),
    [sortedOptions, bouncedFilter],
  );

  return (
    <Stack gap="20px" sx={{ width: '100%', padding: '0 20px 30px' }}>
      <Typography variant="h2">{label}</Typography>
      <SearchInput
        value={filter}
        onChange={(value) => setFilter(value)}
        placeholder={searchPlaceholder || ''}
        onClickSearchButton={() => {}}
      />

      <List sx={{ padding: 0 }}>
        <Virtuoso
          style={{
            height: matches ? 'calc(700px - 224px)' : 'calc(100vh - 224px)',
          }}
          data={filteredOptions}
          components={{
            Footer: () => {
              return filteredOptions.length === 0 ? (
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
                  {item.endBadge ? item.endBadge : null}
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
