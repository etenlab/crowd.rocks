import {
  GetAllSiteTextDefinitionsVariable,
  GetForumsListVariable,
  GetForumFoldersListVariable,
  GetThreadsListVariable,
} from './non-persistent.reducer';

export const actions = {
  ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS:
    'ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS',
  ADD_PAGINATION_VARIABLE_FOR_GET_FORUMS_LIST:
    'ADD_PAGINATION_VARIABLE_FOR_GET_FORUMS_LIST',
  ADD_PAGINATION_VARIABLE_FOR_GET_FORUM_FOLDERS_LIST:
    'ADD_PAGINATION_VARIABLE_FOR_GET_FORUM_FOLDERS_LIST',
  ADD_PAGINATION_VARIABLE_FOR_GET_THREADS_LIST:
    'ADD_PAGINATION_VARIABLE_FOR_GET_THREADS_LIST',
};

export function addPaginationVariableForGetAllSiteTextDefinitions(
  variable: GetAllSiteTextDefinitionsVariable,
) {
  return {
    type: actions.ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS,
    payload: variable,
  };
}

export function addPaginationVariableForGetForumsList(
  variable: GetForumsListVariable,
) {
  return {
    type: actions.ADD_PAGINATION_VARIABLE_FOR_GET_FORUMS_LIST,
    payload: variable,
  };
}

export function addPaginationVariableForGetForumFoldersList(
  variable: GetForumFoldersListVariable,
) {
  return {
    type: actions.ADD_PAGINATION_VARIABLE_FOR_GET_FORUM_FOLDERS_LIST,
    payload: variable,
  };
}

export function addPaginationVariableForGetTheadsList(
  variable: GetThreadsListVariable,
) {
  return {
    type: actions.ADD_PAGINATION_VARIABLE_FOR_GET_THREADS_LIST,
    payload: variable,
  };
}
