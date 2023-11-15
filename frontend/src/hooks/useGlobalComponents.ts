import { useRef, type Dispatch, useCallback, ReactNode } from 'react';
import { nanoid } from 'nanoid';

import {
  addModal,
  removeModal as removeModalAction,
  setIonContentScrollElement as setIonContentScrollElementAction,
} from '../reducers/components.actions';

import { type ActionType } from '../reducers/index';

interface UseGlobalComponentsProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useGlobalComponents({ dispatch }: UseGlobalComponentsProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const createModal = useCallback(() => {
    const id = nanoid();

    return {
      openModal: (
        component: ReactNode,
        mode: 'standard' | 'full' = 'standard',
      ) => {
        dispatchRef.current.dispatch(addModal(id, mode, component));
      },
      closeModal: () => {
        dispatchRef.current.dispatch(removeModalAction(id));
      },
    };
  }, []);

  const removeModal = useCallback((id: string) => {
    dispatchRef.current.dispatch(removeModalAction(id));
  }, []);

  const setIonContentScrollElement = useCallback(
    (scrollElement: HTMLElement | null) => {
      dispatchRef.current.dispatch(
        setIonContentScrollElementAction(scrollElement),
      );
    },
    [],
  );

  return {
    createModal,
    removeModal,
    setIonContentScrollElement,
  };
}
