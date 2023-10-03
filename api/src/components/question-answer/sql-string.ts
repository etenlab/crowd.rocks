import { ErrorType, TableNameType } from 'src/common/types';

export type QuestionItemUpsertsProcedureOutput = {
  p_question_item_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callQuestionItemUpsertsProcedure({
  items,
}: {
  items: string[];
}): [string, [string[]]] {
  return [
    `
      call batch_question_item_upsert($1::text[], null, null, '');
    `,
    [items],
  ];
}

export type GetQuestionItemsObjectByIds = {
  question_item_id: string;
  item: string;
};

export function getQuestionItemsObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        question_item_id,
        item
      from question_items
      where question_item_id = any($1)
    `,
    [ids],
  ];
}

export type QuestionUpsertsProcedureOutput = {
  p_question_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callQuestionUpsertsProcedure({
  parent_tables,
  parent_ids,
  question_type_is_multiselects,
  questions,
  question_items_list,
  token,
}: {
  parent_tables: TableNameType[];
  parent_ids: number[];
  question_type_is_multiselects: boolean[];
  questions: string[];
  question_items_list: number[][];
  token: string;
}): [
  string,
  [TableNameType[], number[], boolean[], string[], string[], string],
] {
  return [
    `
      call batch_question_upsert($1::text[], $2::bigint[], $3::bool[], $4::text[], $5::jsonb[], $6, null, null, '');
    `,
    [
      parent_tables,
      parent_ids,
      question_type_is_multiselects,
      questions,
      question_items_list.map((question_items) =>
        JSON.stringify(
          question_items.map((id) => ({
            id,
          })),
        ),
      ),
      token,
    ],
  ];
}

export type GetQuestionsObjectRow = {
  question_id: string;
  parent_table: TableNameType;
  parent_id: string;
  question_type_is_multiselect: boolean;
  question: string;
  question_items: string[];
  created_at: Date;
  created_by: string;
};

export function getQuestionsObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        question_id,
        parent_table,
        parent_id,
        question_type_is_multiselect,
        question,
        question_items,
        created_at,
        created_by
      from questions
      where question_id = any($1)
    `,
    [ids],
  ];
}

export function getQuestionsObjByRefs(
  refs: {
    parent_table: TableNameType;
    parent_id: number;
  }[],
): [string, [TableNameType[], number[]]] {
  return [
    `
      with pairs (parent_table, parent_id) as (
        select unnest($1::text[]), unnest($2::int[])
      )
      select 
        question_id,
        parent_table,
        parent_id,
        question_type_is_multiselect,
        question,
        question_items,
        created_at,
        created_by
      from questions
      where (parent_table, parent_id) in (
        select parent_table, parent_id
        from pairs
      );
    `,
    [refs.map((ref) => ref.parent_table), refs.map((ref) => ref.parent_id)],
  ];
}

export type AnswerUpsertsProcedureOutput = {
  p_answer_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callAnswerUpsertsProcedure({
  question_ids,
  answers,
  question_items_list,
  token,
}: {
  question_ids: number[];
  answers: string[];
  question_items_list: number[][];
  token: string;
}): [string, [number[], string[], string[], string]] {
  return [
    `
      call batch_answer_upsert($1::bigint[], $2::text[], $3::jsonb[], $4::text, null, null, '');
    `,
    [
      question_ids,
      answers,
      question_items_list.map((question_items) =>
        JSON.stringify(
          question_items.map((id) => ({
            id,
          })),
        ),
      ),
      token,
    ],
  ];
}

export type GetAnswersObjectRow = {
  answer_id: string;
  question_id: string;
  answer: string;
  question_items: string[];
  created_at: Date;
  created_by: string;
};

export function getAnswersObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        answer_id,
        question_id,
        answer,
        question_items,
        created_at,
        created_by
      from answers
      where answer_id = any($1)
    `,
    [ids],
  ];
}

export function getAnswersObjByQuestionIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        answer_id,
        question_id,
        answer,
        question_items,
        created_at,
        created_by
      from answers
      where question_id = any($1)
    `,
    [ids],
  ];
}
