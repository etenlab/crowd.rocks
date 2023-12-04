import { Stack, Button } from '@mui/material';

export type TabsProps<T> = {
  tabs: {
    label: string;
    value: T;
  }[];
  selected: T | null;
  onChange(tab: T): void;
  disabled?: T[];
};

const getBorderRadius = (currentIndex: number, total: number) => {
  if (currentIndex === 0) {
    return '10px 0 0 10px';
  }

  if (currentIndex === total - 1) {
    return '0 10px 10px 0';
  }

  if (total === 1) {
    return '10px';
  }

  return 0;
};

const getBorderLeft = (currentIndex: number, selectedIndex: number) => {
  if (selectedIndex === -1) {
    if (currentIndex === 0) {
      return '';
    } else {
      return 'none';
    }
  } else {
    if (currentIndex === selectedIndex) {
      return '';
    } else {
      return 'none';
    }
  }
};

const getBorderRight = (currentIndex: number, selectedIndex: number) => {
  if (selectedIndex === -1) {
    return '';
  } else {
    if (currentIndex + 1 === selectedIndex) {
      return 'none';
    } else {
      return '';
    }
  }
};

export function Tabs<T>({ tabs, selected, onChange, disabled }: TabsProps<T>) {
  const selectedIndex = tabs.findIndex((tab) => tab.value === selected);
  return (
    <Stack direction="row">
      {tabs.map((tab, index) => (
        <Button
          key={tab.value as string}
          variant="outlined"
          sx={(theme) => ({
            borderRadius: getBorderRadius(index, tabs.length),
            borderRight: getBorderRight(index, selectedIndex),
            borderLeft: getBorderLeft(index, selectedIndex),
            backgroundColor:
              selected === tab.value ? theme.palette.background.blue_10 : '',
            marginLeft: index === 0 ? '' : '-1px',
          })}
          color={selected === tab.value ? 'blue' : 'gray'}
          onClick={() => onChange(tab.value)}
          fullWidth
          disabled={
            disabled && disabled.findIndex((item) => item === tab.value) !== -1
          }
        >
          {tab.label}
        </Button>
      ))}
    </Stack>
  );
}
