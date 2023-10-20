import { Field, InputType, ObjectType, Int, ID } from '@nestjs/graphql';

@InputType()
export class LanguageInput {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
  @Field(() => String, { nullable: true }) filter?: string | null;
}

@ObjectType()
export class LanguageOutput {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class PartialVoteStatus {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PageInfo {
  @Field(() => Boolean) hasNextPage: boolean;
  @Field(() => Boolean) hasPreviousPage: boolean;
  @Field(() => ID, { nullable: true }) startCursor: string | null;
  @Field(() => ID, { nullable: true }) endCursor: string | null;
  @Field(() => Int, { nullable: true }) totalEdges?: number | null;
}
