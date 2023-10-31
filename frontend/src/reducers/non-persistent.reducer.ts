import { actions } from './non-persistent.action';
import { type ActionType } from '.';

export type GetAllSiteTextDefinitionsVariable = {
  filter: string;
  quickFilter: string | null;
  onlyNotTranslated: boolean | null;
  onlyTranslated: boolean | null;
  targetLanguage: {
    language_code: string;
    dialect_code: string | null;
    geo_code: string | null;
  } | null;
};

export interface StateType {
  paginationVariables: {
    getAllSiteTextDefinitions: Record<
      string,
      GetAllSiteTextDefinitionsVariable
    >;
  };
}

export const initialState: StateType = {
  paginationVariables: {
    getAllSiteTextDefinitions: {},
  },
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type, payload } = action;

  switch (type) {
    case actions.ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS: {
      const variable = payload as GetAllSiteTextDefinitionsVariable;
      const langArr = variable.targetLanguage
        ? [
            variable.targetLanguage.language_code,
            variable.targetLanguage.dialect_code,
            variable.targetLanguage.geo_code,
          ]
        : [];

      const keyStr = [
        variable.filter,
        variable.quickFilter,
        variable.onlyNotTranslated,
        variable.onlyTranslated,
        ...langArr,
      ]
        .map((item) => item + '')
        .join('//--//');

      return {
        ...prevState,
        paginationVariables: {
          ...prevState.paginationVariables,
          getAllSiteTextDefinitions: {
            ...prevState.paginationVariables.getAllSiteTextDefinitions,
            [keyStr]: variable,
          },
        },
      };
    }
    default: {
      return prevState;
    }
  }
}
