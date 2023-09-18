import { useState, useRef, MouseEventHandler, useMemo } from 'react';
import { IonPopover, IonItem, IonCheckbox } from '@ionic/react';
import { flagSharp } from 'ionicons/icons';

import { PopoverContainer } from './styled';

import { StChatIcon } from '../../common/styled';

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

export function Flag({ parent_table, parent_id, flag_names }: FlagProps) {
  const [flagOpened, setFlagOpened] = useState<boolean>(false);

  const flagPopoverRef = useRef<HTMLIonPopoverElement>(null);

  const [getFlagsFromRefLazyQuery, { data, error }] =
    useGetFlagsFromRefLazyQuery();
  const [toggleFlagWithRef] = useToggleFlagWithRefMutation(
    parent_table,
    parent_id,
  );

  const handleToggleFlagBtn: MouseEventHandler<HTMLIonIconElement> = (e) => {
    e.stopPropagation();
    flagPopoverRef.current!.event = e;
    setFlagOpened(true);

    getFlagsFromRefLazyQuery({
      variables: {
        parent_table,
        parent_id,
      },
    });
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

  return (
    <>
      <StChatIcon icon={flagSharp} onClick={handleToggleFlagBtn} />
      <IonPopover
        ref={flagPopoverRef}
        isOpen={flagOpened}
        showBackdrop={false}
        onDidDismiss={() => setFlagOpened(false)}
        side="bottom"
        alignment="end"
        style={{
          '--offset-y': '10px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <PopoverContainer>{flagListCom}</PopoverContainer>
      </IonPopover>
    </>
  );
}
