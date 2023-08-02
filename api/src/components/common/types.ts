import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LanguageInput {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
  @Field(() => String, { nullable: true }) filter: string | null;
}
