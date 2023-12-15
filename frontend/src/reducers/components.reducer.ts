import { ReactNode } from 'react';

import { actions } from './components.actions';
import { type ActionType } from '.';

export type ModalMode = 'standard' | 'full';

export interface StateType {
  modals: { id: string; mode: ModalMode; component: ReactNode }[];
  ionContentScrollElement: HTMLElement | null;
}

export const initialState: StateType = {
  modals: [],
  ionContentScrollElement: null,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.ADD_MODAL: {
      const payload = action.payload as {
        id: string;
        mode: ModalMode;
        component: ReactNode;
      };

      return {
        ...prevState,
        modals: prevState.modals
          ? [
              ...prevState.modals.filter((modal) => modal.id !== payload.id),
              payload,
            ]
          : [payload],
      };
    }
    case actions.REMOVE_MODAL: {
      const id = action.payload as string;

      return {
        ...prevState,
        modals: prevState.modals
          ? [...prevState.modals.filter((modal) => modal.id !== id)]
          : [],
      };
    }
    case actions.SET_ION_CONTENT_SCROLL_ELEMENT: {
      return {
        ...prevState,
        ionContentScrollElement: action.payload as HTMLElement | null,
      };
    }
    default: {
      return prevState;
    }
  }
}
