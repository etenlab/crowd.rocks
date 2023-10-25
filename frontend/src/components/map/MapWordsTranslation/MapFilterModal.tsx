import { useState, useCallback, useMemo } from 'react';
import { Stack, Typography, Divider, Button, IconButton } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { Select, OptionItem } from '../../common/forms/Select';

import { useTr } from '../../../hooks/useTr';

import { CheckCircle } from '../../common/icons/CheckCircle';

export type StringFilter = 'all' | 'translated' | 'not translated';
export type SortFilter = 'a - z' | 'z - a';

export type MapFilterModalProps = {
  onChange(filter: {
    stringFilter: StringFilter | null;
    sortFilter: SortFilter | null;
  }): void;
  onClose(): void;
};

export function MapFilterModal({ onChange, onClose }: MapFilterModalProps) {
  const { tr } = useTr();

  const [stringFilter, setStringFilter] = useState<OptionItem>({
    label: tr('All'),
    value: 'all',
  });
  const [sortFilter, setSortFilter] = useState<OptionItem>({
    label: 'A - Z',
    value: 'a - z',
  });

  const handleCancel = () => {
    onClose();
  };

  const stringOptions = useMemo(
    () => [
      {
        label: tr('All'),
        value: 'all',
      },
      // {
      //   label: tr('Translated'),
      //   value: 'translated',
      // },
      // {
      //   label: tr('Not Translated'),
      //   value: 'not translated',
      // },
    ],
    [tr],
  );

  const sortOptions = useMemo(
    () => [
      {
        label: 'A - Z',
        value: 'a - z',
      },
      // {
      //   label: 'Z - A',
      //   value: 'z - a',
      // },
    ],
    [],
  );

  const handleChangeStringFilter = useCallback((value: OptionItem | null) => {
    if (value) {
      setStringFilter(value);
    }
  }, []);

  const handleChangeOrderFilter = useCallback((value: OptionItem | null) => {
    if (value) {
      setSortFilter(value);
    }
  }, []);

  const handleSave = () => {
    onChange({
      stringFilter: stringFilter.value as StringFilter,
      sortFilter: sortFilter.value as SortFilter,
    });
    onClose();
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
        <Select
          placeholder={tr('Select string filter')}
          options={stringOptions}
          value={stringFilter}
          onChange={handleChangeStringFilter}
          onClear={() => {}}
        />
      </Stack>
      <Stack gap="16px">
        <Typography variant="h3">{tr('Sort by')}:</Typography>
        <Select
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
