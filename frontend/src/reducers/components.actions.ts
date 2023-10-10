import { ReactNode } from 'react';

export const actions = {
  SET_MODAL: 'SET_MODAL',
};

export function setModal(com: ReactNode | null) {
  return {
    type: actions.SET_MODAL,
    payload: com,
  };
}
