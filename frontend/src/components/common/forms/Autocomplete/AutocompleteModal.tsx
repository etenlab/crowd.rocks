import { useCallback, useState, useMemo, Fragment } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useDebounce } from 'use-debounce';

import {
  Divider,
  Typography,
  Stack,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  useMediaQuery,
} from '@mui/material';

import { useTr } from '../../../../hooks/useTr';
import { SearchInput } from '../SearchInput';

import { OptionItem } from './Autocomplete';

export type AutocompleteModalProps = {
  options: OptionItem[];
  label?: string;
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClose(): void;
};

export function AutocompleteModal({
  options,
  label,
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
    <Stack sx={{ width: '100%' }}>
      <Stack
        gap="5px"
        sx={(theme) => ({
          padding: '18px',
          paddingTop: matches ? 0 : '18px',
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

        <SearchInput
          value={filter}
          onChange={(value) => setFilter(value)}
          placeholder={label || ''}
          onClickSearchButton={() => {}}
        />
      </Stack>

      <List sx={{ padding: 0 }}>
        <Virtuoso
          style={{
            height: matches ? 'calc(700px - 170px)' : 'calc(100vh - 170px)',
          }}
          data={filteredOptions}
          itemContent={(_index, item) => (
            <Fragment key={item.value as string}>
              <ListItem
                secondaryAction={
                  item.endBadge ? (
                    item.endBadge
                  ) : (
                    <Radio
                      edge="end"
                      checked={item.value === selected?.value}
                    />
                  )
                }
                disablePadding
              >
                <ListItemButton onClick={() => setSelected(item)}>
                  {item.endBadge ? (
                    <ListItemIcon>
                      <Radio
                        edge="end"
                        checked={item.value === selected?.value}
                      />
                    </ListItemIcon>
                  ) : null}
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
