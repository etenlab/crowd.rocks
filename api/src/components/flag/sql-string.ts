import { ErrorType, FlagType } from 'src/common/types';

export type FlagToggleProcedureOutput = {
  p_flag_id: string;
  p_error_type: ErrorType;
};

export function callFlagToggleFlagWithRef({
  parent_table,
  parent_id,
  flag_name,
  token,
}: {
  parent_table: string;
  parent_id: number;
  flag_name: FlagType;
  token: string;
}): [string, [string, number, FlagType, string]] {
  return [
    `
      call flag_toggle($1, $2, $3, $4, 0, '');
    `,
    [parent_table, parent_id, flag_name, token],
  ];
}

export type GetFlagRow = {
  flag_id: string;
  parent_table: string;
  parent_id: string;
  name: FlagType;
  created_at: string;
  created_by: string;
};

export function getFlagsFromRefQuery({
  parent_table,
  parent_id,
}: {
  parent_table: string;
  parent_id: number;
}): [string, [string, number]] {
  return [
    `
      select
        flag_id,
        parent_table,
        parent_id,
        name,
        created_at,
        created_by
      from flags
      where parent_table = $1
        and parent_id = $2;
    `,
    [parent_table, parent_id],
  ];
}
