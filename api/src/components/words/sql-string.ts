export function getWordObjByIdSQL(id: string): [string, [string]] {
  return [
    `
      select 
        wordlike_string as word,
        word_definitions.word_definition_id as word_definition_id,
        word_definitions.definition as definition,
        language_code,
        dialect_code, 
        geo_code
      from words
      inner join wordlike_strings
        on wordlike_strings.wordlike_string_id = words.wordlike_string_id
      full outer join word_definitions
        on words.word_definition_id = word_definitions.word_definition_id
      where words.word_id = $1
    `,
    [id],
  ];
}
