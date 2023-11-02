import { useRef, type Dispatch, useCallback } from 'react';

import { addPaginationVariableForGetAllSiteTextDefinitions as addPaginationVariableForGetAllSiteTextDefinitionsAction } from '../reducers/non-persistent.action';

import { type ActionType } from '../reducers/index';
import { GetAllSiteTextDefinitionsVariable } from '../reducers/non-persistent.reducer';

interface UseNonPersistentProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useNonPersistent({ dispatch }: UseNonPersistentProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const addPaginationVariableForGetAllSiteTextDefinitions = useCallback(
    (variable: GetAllSiteTextDefinitionsVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetAllSiteTextDefinitionsAction(variable),
      );
    },
    [],
  );

  return {
    addPaginationVariableForGetAllSiteTextDefinitions,
  };
}
