import { useRef, type Dispatch, useCallback, ReactNode } from 'react';

import { setModal as setModalAction } from '../reducers/components.actions';

import { type ActionType } from '../reducers/index';

interface UseGlobalComponentsProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobalComponents({ dispatch }: UseGlobalComponentsProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const setModal = useCallback((com: ReactNode) => {
    dispatchRef.current.dispatch(setModalAction(com));
  }, []);

  return {
    setModal,
  };
}
