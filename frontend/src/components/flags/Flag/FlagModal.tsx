import { useMemo } from 'react';

import {
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';

import { ErrorType, FlagType, TableNameType } from '../../../generated/graphql';
import { useGetFlagsFromRefQuery } from '../../../generated/graphql';

import { Checkbox } from '../../common/buttons/Checkbox';

import { useToggleFlagWithRefMutation } from '../../../hooks/useToggleFlagWithRefMutation';

import { useTr } from '../../../hooks/useTr';
import { FlagName } from '../flagGroups';

import { globals } from '../../../services/globals';

type FlagModalProps = {
  parent_table: TableNameType;
  parent_id: string;
  flag_names: FlagName[];
  onClose(): void;
};
export function FlagModal({
  onClose,
  flag_names,
  parent_id,
  parent_table,
}: FlagModalProps) {
  const { tr } = useTr();

  const { data, error } = useGetFlagsFromRefQuery({
    variables: {
      parent_table,
      parent_id,
    },
  });
  const [toggleFlagWithRef] = useToggleFlagWithRefMutation(
    parent_table,
    parent_id,
  );

  const handleToggleFlagItem = (flag: FlagType) => {
    toggleFlagWithRef({
      variables: {
        parent_table,
        parent_id,
        name: flag,
      },
    });
  };

  const flagMap = useMemo(() => {
    const flagMap = new Map<string, boolean>();

    if (!error && data && data.getFlagsFromRef.error === ErrorType.NoError) {
      data.getFlagsFromRef.flags.map((flag) => flagMap.set(flag.name, true));
    }

    return flagMap;
  }, [data, error]);

  const flagListCom = flag_names
    .filter((flag_name) => {
      if (flag_name.role === 'admin-only' && globals.get_user_id() !== 1) {
        return false;
      } else {
        return true;
      }
    })
    .map((flag_name) => (
      <ListItem key={flag_name.flag} disablePadding>
        <ListItemButton
          onClick={() => handleToggleFlagItem(flag_name.flag)}
          sx={(theme) => ({
            borderRadius: '10px',
            border: `1px solid ${theme.palette.text.gray_stroke}`,
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
              <Checkbox
                color={
                  flagMap.get(flag_name.flag) || false ? 'blue' : 'gray_stroke'
                }
                checked={flagMap.get(flag_name.flag) || false}
              />
              <Typography variant="h5" sx={{ fontWeight: 400 }}>
                {flag_name.label}
              </Typography>
            </Stack>
          </Stack>
        </ListItemButton>
      </ListItem>
    ));

  return (
    <Stack gap="24px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Flag')}</Typography>
        <IconButton onClick={onClose}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>

      <List sx={{ padding: 0 }}>{flagListCom}</List>
    </Stack>
  );
}
