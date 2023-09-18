import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FlagType, GenericOutput } from 'src/common/types';

import { WordDefinition, PhraseDefinition } from '../definitions/types';

import { PageInfo } from '../common/types';

@ObjectType()
export class Flag {
  @Field(() => ID) flag_id: string;
  @Field(() => String) parent_table: string;
  @Field(() => ID) parent_id: string;
  @Field(() => FlagType) name: string;
  @Field(() => String) created_at: string;
  @Field(() => ID) created_by: string;
}

@ObjectType()
export class FlagOutput extends GenericOutput {
  @Field(() => Flag, { nullable: true }) flag: Flag | null;
}

@ObjectType()
export class FlagsOutput extends GenericOutput {
  @Field(() => [Flag]) flags: Flag[];
}

@ObjectType()
export class FlagsListOutput extends GenericOutput {
  @Field(() => [[Flag]]) flags_list: Flag[][];
}

@ObjectType()
export class PhraseDefinitionListEdge {
  @Field(() => ID) cursor: string;
  @Field(() => PhraseDefinition) node: PhraseDefinition;
}

@ObjectType()
export class PhraseDefinitionListConnection extends GenericOutput {
  @Field(() => [PhraseDefinitionListEdge]) edges: PhraseDefinitionListEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class WordDefinitionListEdge {
  @Field(() => ID) cursor: string;
  @Field(() => WordDefinition) node: WordDefinition;
}

@ObjectType()
export class WordDefinitionListConnection extends GenericOutput {
  @Field(() => [WordDefinitionListEdge]) edges: WordDefinitionListEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}
