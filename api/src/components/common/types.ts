import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';

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
