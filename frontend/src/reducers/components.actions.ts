import { ReactNode } from 'react';

export const actions = {
  ADD_MODAL: 'ADD_MODAL',
  REMOVE_MODAL: 'REMOVE_MODAL',
};

export function addModal(
  id: string,
  mode: 'full' | 'standard',
  component: ReactNode | null,
) {
  return {
    type: actions.ADD_MODAL,
    payload: {
      id,
      mode,
      component,
    },
  };
}

export function removeModal(id: string) {
  return {
    type: actions.REMOVE_MODAL,
    payload: id,
  };
}
