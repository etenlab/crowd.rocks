import { useState } from 'react';
import { Stack, Typography, Divider, Button, IconButton } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { Autocomplete, OptionItem } from '../../common/forms/Autocomplete';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { CheckCircle } from '../../common/icons/CheckCircle';

export type StringFilter = 'all' | 'translated' | 'not translated';
export type SortFilter = 'a - z' | 'z - a';

export type MapFilterModalProps = {
  onChange(filter: {
    stringFilter: StringFilter;
    sortFilter: SortFilter;
  }): void;
};

export function MapFilterModal({ onChange }: MapFilterModalProps) {
  const { tr } = useTr();
  const {
    actions: { setModal },
  } = useAppContext();

  const [stringFilter, setStringFilter] = useState<OptionItem>({
    label: tr('All'),
    value: 'all',
  });
  const [sortFilter, setSortFilter] = useState<OptionItem>({
    label: 'A - Z',
    value: 'a - z',
  });

  const handleCancel = () => {
    setModal(null);
  };

  const stringOptions = [
    {
      label: tr('All'),
      value: 'all',
    },
    {
      label: tr('Translated'),
      value: 'translated',
    },
    {
      label: tr('Not Translated'),
      value: 'not translated',
    },
  ];

  const sortOptions = [
    {
      label: 'A - Z',
      value: 'a - z',
    },
    {
      label: 'Z - A',
      value: 'z - a',
    },
  ];

  const handleChangeStringFilter = (value: OptionItem | null) => {
    if (value) {
      setStringFilter(value);
    } else {
      setStringFilter({
        label: tr('All'),
        value: 'all',
      });
    }
  };

  const handleChangeOrderFilter = (value: OptionItem | null) => {
    if (value) {
      setSortFilter(value);
    } else {
      setSortFilter({
        label: 'A - Z',
        value: 'a - z',
      });
    }
  };

  const handleSave = () => {
    onChange({
      stringFilter: stringFilter.value as StringFilter,
      sortFilter: sortFilter.value as SortFilter,
    });
    setModal(null);
  };

  return (
    <Stack gap="24px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Filter')}</Typography>
        <IconButton onClick={handleCancel}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
      <Divider />
      <Stack gap="16px">
        <Typography variant="h3">{tr('Strings')}:</Typography>
        <Autocomplete
          placeholder={tr('Select string filter')}
          options={stringOptions}
          value={stringFilter}
          onChange={handleChangeStringFilter}
          onClear={() => {}}
        />
      </Stack>
      <Stack gap="16px">
        <Typography variant="h3">{tr('Sort by')}:</Typography>
        <Autocomplete
          placeholder={tr('Select sort filter')}
          options={sortOptions}
          value={sortFilter}
          onChange={handleChangeOrderFilter}
          onClear={() => {}}
        />
      </Stack>

      <Button
        variant="contained"
        color="blue"
        startIcon={<CheckCircle sx={{ fontSize: 24 }} />}
        onClick={handleSave}
      >
        {tr('Save')}
      </Button>
    </Stack>
  );
}
