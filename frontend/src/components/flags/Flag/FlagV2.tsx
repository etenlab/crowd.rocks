import { MouseEvent } from 'react';
import { Button } from '@mui/material';

import { WhiteFlag } from '../../common/icons/WhiteFlag';

import { TableNameType } from '../../../generated/graphql';

import { FlagName } from '../flagGroups';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { FlagModal } from './FlagModal';

type FlagProps = {
  parent_table: TableNameType;
  parent_id: string;
  flag_names: FlagName[];
};

export function FlagV2({ parent_table, parent_id, flag_names }: FlagProps) {
  const { tr } = useTr();
  const {
    actions: { createModal },
  } = useAppContext();

  const { openModal, closeModal } = createModal();

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    openModal(
      <FlagModal
        parent_table={parent_table}
        parent_id={parent_id}
        flag_names={flag_names}
        onClose={closeModal}
      />,
    );

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Button
      variant="text"
      onClick={handleClick}
      color="red"
      startIcon={<WhiteFlag sx={{ fontSize: 18 }} />}
      sx={{ padding: 0, justifyContent: 'flex-start' }}
    >
      {tr('Flag')}
    </Button>
  );
}
