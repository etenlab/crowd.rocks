import { useDebounce } from 'use-debounce';
import { useTr } from '../../../hooks/useTr';
import { useCallback, useMemo, useState } from 'react';
import { Select } from '../../common/forms/Select';
import { Caption } from '../../common/Caption/Caption';
import { Stack } from '@mui/material';
import { SearchInput } from '../../common/forms/SearchInput';
import { useParams } from 'react-router';
import { PageLayout } from '../../common/PageLayout';
import { PericopiesTrList } from './PericopiesTrList';
import { FilterKind } from '../../super-tool/SuperDocumentViewerPage/ToolBox';
import { OptionItem } from '../../common/forms/Autocomplete';

export function PericopiesTrListPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const { tr } = useTr();

  const filterOptions = useMemo(
    () => [
      {
        label: tr('All'),
        value: FilterKind.All,
      },
      {
        label: tr('Translated'),
        value: FilterKind.Translated,
      },
      {
        label: tr('Not Translated'),
        value: FilterKind.NotTranslated,
      },
    ],
    [tr],
  );

  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter] = useDebounce(filter, 500);
  const [filterOption, setFilterOption] = useState<OptionItem<FilterKind>>({
    label: tr('All'),
    value: FilterKind.All,
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleChangeFilterOption = useCallback(
    (value: OptionItem<FilterKind> | null) => {
      if (value) {
        setFilterOption(value);
      }
    },
    [],
  );

  return (
    <>
      <PageLayout>
        <Caption>{tr('Sections List')}</Caption>

        <Stack gap="14px">
          <Select
            placeholder={tr('Select sort filter')}
            options={filterOptions}
            value={filterOption}
            onChange={handleChangeFilterOption}
            onClear={() => {
              setFilterOption({
                label: tr('All'),
                value: FilterKind.All,
              });
            }}
          />

          <SearchInput
            value={filter}
            onChange={handleFilterChange}
            onClickSearchButton={() => {}}
            placeholder={tr('Search by text strings ...')}
          />
        </Stack>

        {documentId && (
          <PericopiesTrList
            documentId={documentId}
            filterKind={filterOption.value}
            stringFilter={debouncedFilter}
          />
        )}
      </PageLayout>
    </>
  );
}
