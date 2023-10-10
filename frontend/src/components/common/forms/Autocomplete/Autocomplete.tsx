import { useCallback, useState, SyntheticEvent } from 'react';

import {
  Autocomplete as MuiAutocomplete,
  Divider,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';

import { Cancel } from '../../icons/Cancel';
import { NavArrowDown } from '../../icons/NavArrowDown';

import { StyledPaper, StyledPopper, StyledInput } from './styled';

export type OptionItem = {
  label: string;
  value: unknown;
};

export type AutocompleteProps = {
  options: OptionItem[];
  placeholder: string;
  label?: string;
  value: OptionItem | null;
  onChange(value: OptionItem | null): void;
  onClear?(): void;
  disabled?: boolean;
};

export function Autocomplete({
  options,
  placeholder,
  label,
  value,
  disabled,
  onChange,
  onClear,
}: AutocompleteProps) {
  const [open, setOpen] = useState<boolean>(false);
  const handleChangeValue = useCallback(
    (_event: SyntheticEvent<Element, Event>, newValue: OptionItem | null) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <Stack gap="10px">
      {label ? (
        <Typography variant="overline" color="text.gray_text">
          {label}
        </Typography>
      ) : null}
      <MuiAutocomplete
        disabled={disabled}
        options={options}
        getOptionLabel={(option) => option.label}
        fullWidth={true}
        value={value}
        open={open}
        onBlur={() => {
          setOpen(false);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onChange={handleChangeValue}
        PopperComponent={StyledPopper}
        renderInput={(params) => (
          <StyledPaper variant="outlined" ref={params.InputProps.ref}>
            <StyledInput {...params.inputProps} placeholder={placeholder} />
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ height: '24px', marginTop: 0, marginBottom: 0 }}
            />
            <IconButton sx={{ padding: 0 }}>
              {value === null ? (
                <NavArrowDown
                  sx={{ fontSize: 24 }}
                  color="dark"
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              ) : (
                <Cancel
                  sx={{ fontSize: 24 }}
                  color="red"
                  onClick={() => {
                    onChange(null);
                    onClear && onClear();
                  }}
                />
              )}
            </IconButton>
          </StyledPaper>
        )}
      />
    </Stack>
  );
}
