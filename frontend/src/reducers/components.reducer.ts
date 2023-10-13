import { ReactNode } from 'react';

import { actions } from './components.actions';
import { type ActionType } from '.';

export interface StateType {
  modal: ReactNode | null;
}

export const initialState: StateType = {
  modal: null,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.SET_MODAL: {
      return {
        ...prevState,
        modal: action.payload as ReactNode,
      };
    }
    default: {
      return prevState;
    }
  }
}
