import { ReactNode } from 'react';

import { ModalMode } from './components.reducer';

export const actions = {
  ADD_MODAL: 'ADD_MODAL',
  REMOVE_MODAL: 'REMOVE_MODAL',
  SET_ION_CONTENT_SCROLL_ELEMENT: 'SET_ION_CONTENT_SCROLL_ELEMENT',
};

export function addModal(
  id: string,
  mode: ModalMode,
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

export function setIonContentScrollElement(scrollElement: HTMLElement | null) {
  return {
    type: actions.SET_ION_CONTENT_SCROLL_ELEMENT,
    payload: scrollElement,
  };
}
