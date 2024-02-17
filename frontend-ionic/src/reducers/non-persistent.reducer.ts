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

export type GetForumsListVariable = {
  filter: string | null;
};

export type GetForumFoldersListVariable = {
  filter: string | null;
  forum_id: string;
};

export type GetThreadsListVariable = {
  filter: string | null;
  forum_folder_id: string;
};

export type GetAllDocumentsVariable = {
  input: {
    filter: string | null;
    language_code: string;
    dialect_code: string | null;
    geo_code: string | null;
  };
};

export interface StateType {
  paginationVariables: {
    getAllSiteTextDefinitions: Record<
      string,
      GetAllSiteTextDefinitionsVariable
    >;
    getForumsLists: Record<string, GetForumsListVariable>;
    getForumFoldersLists: Record<string, GetForumFoldersListVariable>;
    getThreadsLists: Record<string, GetThreadsListVariable>;
    getAllDocuments: Record<string, GetAllDocumentsVariable>;
  };
}

export const initialState: StateType = {
  paginationVariables: {
    getAllSiteTextDefinitions: {},
    getForumsLists: {},
    getForumFoldersLists: {},
    getThreadsLists: {},
    getAllDocuments: {},
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
    case actions.ADD_PAGINATION_VARIABLE_FOR_GET_FORUMS_LIST: {
      const variable = payload as GetForumsListVariable;

      const keyStr = [variable.filter].map((item) => item + '').join('//--//');

      return {
        ...prevState,
        paginationVariables: {
          ...prevState.paginationVariables,
          getForumsLists: {
            ...prevState.paginationVariables.getForumsLists,
            [keyStr]: variable,
          },
        },
      };
    }
    case actions.ADD_PAGINATION_VARIABLE_FOR_GET_FORUM_FOLDERS_LIST: {
      const variable = payload as GetForumFoldersListVariable;

      const keyStr = [variable.forum_id, variable.filter]
        .map((item) => item + '')
        .join('//--//');

      return {
        ...prevState,
        paginationVariables: {
          ...prevState.paginationVariables,
          getForumFoldersLists: {
            ...prevState.paginationVariables.getForumFoldersLists,
            [keyStr]: variable,
          },
        },
      };
    }
    case actions.ADD_PAGINATION_VARIABLE_FOR_GET_THREADS_LIST: {
      const variable = payload as GetThreadsListVariable;

      const keyStr = [variable.forum_folder_id, variable.filter]
        .map((item) => item + '')
        .join('//--//');

      return {
        ...prevState,
        paginationVariables: {
          ...prevState.paginationVariables,
          getThreadsLists: {
            ...prevState.paginationVariables.getThreadsLists,
            [keyStr]: variable,
          },
        },
      };
    }
    case actions.ADD_PAGINATION_VARIABLE_FOR_GET_ALL_DOCUMENTS: {
      const variable = payload as GetAllDocumentsVariable;

      const keyStr = [
        variable.input.filter,
        variable.input.language_code,
        variable.input.dialect_code || '',
        variable.input.geo_code || '',
      ]
        .map((item) => item + '')
        .join('//--//');

      return {
        ...prevState,
        paginationVariables: {
          ...prevState.paginationVariables,
          getAllDocuments: {
            ...prevState.paginationVariables.getAllDocuments,
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
