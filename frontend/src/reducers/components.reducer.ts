import { ReactNode } from 'react';

import { actions } from './components.actions';
import { type ActionType } from '.';

export interface StateType {
  modals: { id: string; mode: 'standard' | 'full'; component: ReactNode }[];
}

export const initialState: StateType = {
  modals: [],
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
        mode: 'standard' | 'full';
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
    default: {
      return prevState;
    }
  }
}
