import {
  type StateType as GlobalStateType,
  initialState as globalInitialState,
  reducer as globalReducer,
} from './global.reducer';

export interface ActionType<T> {
  type: string;
  payload: T;
}

export interface StateType {
  global: GlobalStateType;
}

export const initialState = {
  global: globalInitialState,
};

const CROWD_ROCKS_STATE = 'CROWD_ROCKS_STATE';

export function persistStore(state: StateType) {
  try {
    window.localStorage.setItem(
      CROWD_ROCKS_STATE,
      JSON.stringify({
        ...state,
        global: {
          ...state.global,
        },
        components: {},
      }),
    );
  } catch (err) {
    console.log(err);
  }
}

export function loadPersistedStore(): StateType {
  try {
    const state = window.localStorage.getItem(CROWD_ROCKS_STATE);

    if (state === null) {
      return initialState;
    }

    const newState = JSON.parse(state) as StateType;
    return {
      ...newState,
      global: {
        ...newState.global,
      },
    };
  } catch (err) {
    console.log(err);
  }

  return initialState;
}

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const newState = {
    global: globalReducer(state.global, action),
  };

  persistStore(newState);

  return newState;
}
