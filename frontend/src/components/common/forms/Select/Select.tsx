import { useCallback, useMemo } from 'react';

import { Divider, IconButton, Typography, Stack } from '@mui/material';

import { Cancel } from '../../icons/Cancel';
import { NavArrowDown } from '../../icons/NavArrowDown';

import { useAppContext } from '../../../../hooks/useAppContext';

import { StyledPaper } from './styled';
import { SelectModal } from './SelectModal';

export type OptionItem = {
  label: string;
  value: unknown;
};

export type SelectProps = {
  options: OptionItem[];
  placeholder: string;
  label?: string;
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClear?(): void;
  disabled?: boolean;
};

export function Select({
  placeholder,
  label,
  options,
  value,
  disabled,
  onChange,
  onClear,
}: SelectProps) {
  const {
    actions: { createModal },
  } = useAppContext();
  const { openModal, closeModal } = createModal();

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

  const handleOpenModal = useCallback(() => {
    openModal(
      <SelectModal
        options={sortedOptions}
        value={value}
        onClose={closeModal}
        onChange={onChange}
      />,
      'full',
    );
  }, [closeModal, onChange, openModal, sortedOptions, value]);

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
            <NavArrowDown sx={{ fontSize: 24 }} color="dark" />
          ) : (
            <Cancel sx={{ fontSize: 24 }} color="red" />
          )}
        </IconButton>
      </StyledPaper>
    </Stack>
  );
}
