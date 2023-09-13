import { ErrorType, FlagType, TableNameType } from 'src/common/types';

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
  parent_table: TableNameType;
  parent_id: number;
  flag_name: FlagType;
  token: string;
}): [string, [TableNameType, number, FlagType, string]] {
  return [
    `
      call flag_toggle($1, $2, $3, $4, 0, '');
    `,
    [parent_table, parent_id, flag_name, token],
  ];
}

export type GetFlagRow = {
  flag_id: string;
  parent_table: TableNameType;
  parent_id: string;
  name: FlagType;
  created_at: string;
  created_by: string;
};

export function getFlagsFromRefQuery({
  parent_table,
  parent_id,
}: {
  parent_table: TableNameType;
  parent_id: number;
}): [string, [TableNameType, number]] {
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

export function getFlagsFromRefsQuery(
  refs: {
    parent_table: TableNameType;
    parent_id: number;
  }[],
): [string, [TableNameType[], number[]]] {
  return [
    `
      with paris (parent_table, parent_id) as (
        select unnest($1::text[]), unnest($2::int[])
      )
      select
        flag_id,
        parent_table,
        parent_id,
        name,
        created_at,
        created_by
      from flags
      where (parent_table, parent_id) in (
        select parent_table, parent_id
        from pairs
      );
    `,
    [refs.map((ref) => ref.parent_table), refs.map((ref) => ref.parent_id)],
  ];
}

export function getWordsByFlag(
  flag_name: FlagType,
): [string, [TableNameType, FlagType]] {
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
        and name = $2;
    `,
    [TableNameType.word_definitions, flag_name],
  ];
}

export function getPhrasesByFlag(
  flag_name: FlagType,
): [string, [TableNameType, FlagType]] {
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
        and name = $2;
    `,
    [TableNameType.phrase_definitions, flag_name],
  ];
}
