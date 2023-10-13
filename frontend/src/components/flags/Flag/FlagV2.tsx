import { useState, MouseEvent, useMemo } from 'react';
import { IonItem, IonCheckbox } from '@ionic/react';
import { IconButton, Popover } from '@mui/material';

import { MoreHoriz } from '../../common/icons/MoreHoriz';

import { PopoverContainer } from './styled';

import { ErrorType, FlagType, TableNameType } from '../../../generated/graphql';
import { useGetFlagsFromRefLazyQuery } from '../../../generated/graphql';

import { useToggleFlagWithRefMutation } from '../../../hooks/useToggleFlagWithRefMutation';
import { FlagName } from '../flagGroups';
import { globals } from '../../../services/globals';

type FlagProps = {
  parent_table: TableNameType;
  parent_id: string;
  flag_names: FlagName[];
};

export function FlagV2({ parent_table, parent_id, flag_names }: FlagProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [getFlagsFromRefLazyQuery, { data, error }] =
    useGetFlagsFromRefLazyQuery();
  const [toggleFlagWithRef] = useToggleFlagWithRefMutation(
    parent_table,
    parent_id,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    getFlagsFromRefLazyQuery({
      variables: {
        parent_table,
        parent_id,
      },
    });

    setAnchorEl(event.currentTarget);

    event.preventDefault();
    event.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <IonItem key={flag_name.flag}>
        <IonCheckbox
          justify="space-between"
          onIonChange={(e) => {
            e.stopPropagation();
            handleToggleFlagItem(flag_name.flag);
          }}
          checked={flagMap.get(flag_name.flag) || false}
        >
          {flag_name.label}
        </IonCheckbox>
      </IonItem>
    ));

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="gray"
        sx={(theme) => ({
          padding: '4px',
          background: theme.palette.text.white,
          border: `1.5px solid ${theme.palette.text.gray_stroke}`,
        })}
      >
        <MoreHoriz sx={{ fontSize: 24 }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={(theme) => ({
          '& .MuiPopover-paper': {
            gap: '12px',
            padding: '19px 15px',
            border: `1.5px solid ${theme.palette.text.gray_stroke}`,
            borderRadius: '8px',
          },
        })}
      >
        <PopoverContainer>{flagListCom}</PopoverContainer>
      </Popover>
    </>
  );
}
