import { ReactNode } from 'react';
import { Divider, IconButton, Typography, Stack } from '@mui/material';

import { Cancel } from '../../icons/Cancel';
import { NavArrowDown } from '../../icons/NavArrowDown';
import { AutocompleteModal } from './AutocompleteModal';

import { StyledPaper } from './styled';

import { useAppContext } from '../../../../hooks/useAppContext';

export type OptionItem<T = unknown> = {
  label: string;
  value: T;
  endBadge?: ReactNode;
};

export type AutocompleteProps = {
  options: OptionItem[];
  placeholder: string;
  searchPlaceholder?: string;
  label?: string;
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClear?(): void;
  disabled?: boolean;
};

export function Autocomplete({
  options,
  placeholder,
  searchPlaceholder,
  label,
  value,
  disabled,
  onChange,
  onClear,
}: AutocompleteProps) {
  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const handleOpenModal = () => {
    openModal(
      <AutocompleteModal
        options={options}
        searchPlaceholder={searchPlaceholder}
        label={label}
        value={value}
        onChange={onChange}
        onClose={closeModal}
      />,
      'full',
    );
  };

  const inputCom = disabled ? (
    <Typography
      variant="h4"
      color="text.gray"
      sx={{ flex: 1, opacity: value ? 1 : 0.5 }}
    >
      {value?.label || placeholder}
    </Typography>
  ) : (
    <Typography
      variant="h4"
      color="text.dark"
      sx={{ flex: 1, cursor: 'pointer', opacity: value ? 1 : 0.5 }}
      onClick={handleOpenModal}
    >
      {value?.label || placeholder}
    </Typography>
  );

  return (
    <Stack gap="10px">
      {label ? (
        <Typography variant="overline" color="text.gray_text">
          {label}
        </Typography>
      ) : null}
      <StyledPaper
        variant="outlined"
        sx={{ backgroundColor: (theme) => theme.palette.background.gray_bg }}
      >
        {inputCom}
        <Divider
          orientation="vertical"
          variant="middle"
          sx={{ height: '16px', marginTop: 0, marginBottom: 0 }}
        />
        <IconButton
          sx={{ padding: 0 }}
          onClick={() => {
            if (value === null) {
              handleOpenModal();
            } else {
              closeModal();
              onChange(null);
              onClear && onClear();
            }
          }}
          disabled={disabled}
        >
          {value === null ? (
            <NavArrowDown sx={{ fontSize: 22 }} color="dark" />
          ) : (
            <Cancel sx={{ fontSize: 22 }} color="red" />
          )}
        </IconButton>
      </StyledPaper>
    </Stack>
  );
}
