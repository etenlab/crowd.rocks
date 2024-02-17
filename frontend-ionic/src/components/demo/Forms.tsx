import { useState } from 'react';

import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';

import { SearchInput } from '../common/forms/SearchInput/SearchInput';
import { Autocomplete } from '../common/forms/Autocomplete/Autocomplete';

const top100Films = [
  { label: 'The Shawshank Redemption', value: '1' },
  { label: 'The Godfather', value: '2' },
  { label: 'The Godfather: Part II', value: '3' },
  { label: 'The Dark Knight', value: '4' },
  { label: '12 Angry Men', value: '5' },
  { label: "Schindler's List", value: '6' },
  { label: 'Pulp Fiction', value: '7' },
  {
    label: 'The Lord of the Rings: The Return of the King',
    value: '8',
  },
  { label: 'The Good, the Bad and the Ugly', value: '9' },
  { label: 'Fight Club', value: '10' },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    value: '11',
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    value: '12',
  },
  { label: 'Forrest Gump', value: '13' },
  { label: 'Inception', value: '14' },
  {
    label: 'The Lord of the Rings: The Two Towers',
    value: '15',
  },
  { label: "One Flew Over the Cuckoo's Nest", value: '16' },
  { label: 'Goodfellas', value: '17' },
  { label: 'The Matrix', value: '18' },
  { label: 'Seven Samurai', value: '19' },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    value: '20',
  },
];

export function Forms() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoCompleteValue, setAutoCompleteValue] = useState<{
    label: string;
    value: unknown;
  } | null>(null);

  return (
    <PageLayout>
      <Caption>UI Forms</Caption>

      <SearchInput
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        placeholder="Label"
        onClickSearchButton={() => {}}
      />

      <Autocomplete
        options={top100Films}
        placeholder="Label"
        label="Label"
        value={autoCompleteValue}
        onChange={(value) => setAutoCompleteValue(value)}
      />
    </PageLayout>
  );
}
