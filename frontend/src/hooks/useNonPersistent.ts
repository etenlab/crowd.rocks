import { useRef, type Dispatch, useCallback } from 'react';

import {
  addPaginationVariableForGetAllSiteTextDefinitions as addPaginationVariableForGetAllSiteTextDefinitionsAction,
  addPaginationVariableForGetForumsList as addPaginationVariableForGetForumsListAction,
  addPaginationVariableForGetForumFoldersList as addPaginationVariableForGetForumFoldersListAction,
  addPaginationVariableForGetTheadsList as addPaginationVariableForGetTheadsListAction,
  addPaginationVariableForGetAllDocuments as addPaginationVariableForGetAllDocumentsAction,
} from '../reducers/non-persistent.action';

import { type ActionType } from '../reducers/index';
import {
  GetAllSiteTextDefinitionsVariable,
  GetForumsListVariable,
  GetForumFoldersListVariable,
  GetThreadsListVariable,
  GetAllDocumentsVariable,
} from '../reducers/non-persistent.reducer';

interface UseNonPersistentProps {
  dispatch: Dispatch<ActionType<unknown>>;
}

export function useNonPersistent({ dispatch }: UseNonPersistentProps) {
  const dispatchRef = useRef<{ dispatch: Dispatch<ActionType<unknown>> }>({
    dispatch,
  });

  const addPaginationVariableForGetAllSiteTextDefinitions = useCallback(
    (variable: GetAllSiteTextDefinitionsVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetAllSiteTextDefinitionsAction(variable),
      );
    },
    [],
  );

  const addPaginationVariableForGetForumsList = useCallback(
    (variable: GetForumsListVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetForumsListAction(variable),
      );
    },
    [],
  );

  const addPaginationVariableForGetForumFoldersList = useCallback(
    (variable: GetForumFoldersListVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetForumFoldersListAction(variable),
      );
    },
    [],
  );

  const addPaginationVariableForGetTheadsList = useCallback(
    (variable: GetThreadsListVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetTheadsListAction(variable),
      );
    },
    [],
  );

  const addPaginationVariableForGetAllDocuments = useCallback(
    (variable: GetAllDocumentsVariable) => {
      dispatchRef.current.dispatch(
        addPaginationVariableForGetAllDocumentsAction(variable),
      );
    },
    [],
  );

  return {
    addPaginationVariableForGetAllSiteTextDefinitions,
    addPaginationVariableForGetForumsList,
    addPaginationVariableForGetForumFoldersList,
    addPaginationVariableForGetTheadsList,
    addPaginationVariableForGetAllDocuments,
  };
}
