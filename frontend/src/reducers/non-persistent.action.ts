import { GetAllSiteTextDefinitionsVariable } from './non-persistent.reducer';

export const actions = {
  ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS:
    'ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS',
};

export function addPaginationVariableForGetAllSiteTextDefinitions(
  variable: GetAllSiteTextDefinitionsVariable,
) {
  return {
    type: actions.ADD_PAGINATION_VARIABLE_FOR_GET_ALL_SITE_TEXT_DEFINITIONS,
    payload: variable,
  };
}
