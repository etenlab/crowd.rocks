import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FlagType, GenericOutput } from 'src/common/types';

@ObjectType()
export class Flag {
  @Field(() => ID) flag_id: string;
  @Field(() => String) parent_table: string;
  @Field(() => String) parent_id: string;
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
