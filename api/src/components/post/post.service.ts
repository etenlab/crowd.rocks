import { Injectable } from '@nestjs/common';
import { PostgresService } from 'src/core/postgres.service';

interface PostNames {
  forum_name: string;
  thread_name: string;
  folder_name: string;
}

@Injectable()
export class PostService {
  constructor(private pg: PostgresService) {}

  async generatePostNames(
    parent_id: number,
    parent_table: string,
  ): Promise<PostNames> {
    let forum_name = 'Default Forum';
    const folder_name = parent_table;
    let thread_name = 'Default Thread';
    switch (parent_table) {
      case 'words': {
        forum_name = 'Dictionary';
        thread_name = forum_name + ' - ';
        const titleRes = await this.pg.pool.query(
          `
            select 
              wls.wordlike_string
            from
              words w
            join wordlike_strings wls
              on w.wordlike_string_id = wls.wordlike_string_id
            where
              w.word_id = $1
            `,
          [parent_id],
        );
        thread_name += titleRes.rows[0].wordlike_string;
        break;
      }
      case 'word_definitions': {
        forum_name = 'Dictionary';
        thread_name = forum_name + ' - ';
        const titleRes = await this.pg.pool.query(
          `
            select 
              wd.definition,
              wls.wordlike_string
            from
              word_definitions wd
            join words w
              on w.word_id = wd.word_id
            join wordlike_strings wls
              on w.wordlike_string_id = wls.wordlike_string_id
            where wd.word_definition_id = $1
            `,
          [parent_id],
        );
        thread_name +=
          titleRes.rows[0].wordlike_string + ': ' + titleRes.rows[0].definition;
        break;
      }
    }
    return {
      thread_name,
      folder_name,
      forum_name,
    };
  }
}
