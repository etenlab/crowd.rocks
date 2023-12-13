import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionStatus } from 'src/common/types';
import { LanguageInput } from '../common/types';

@ObjectType()
export class Populator {
  @Field(() => ID) id: string;
}

@InputType()
export class DataGenInput {
  @Field(() => Int, { nullable: true }) mapAmount?: number;
  @Field(() => [LanguageInput], { nullable: true })
  mapsToLanguages?: LanguageInput[];
  @Field(() => Int, { nullable: true }) userAmount?: number;
  @Field(() => Int, { nullable: true }) wordAmount?: number;
  @Field(() => Int, { nullable: true }) phraseAmount?: number;
  @Field(() => Int, { nullable: true }) docAmount?: number;
  @Field(() => Int, { nullable: true }) postsPerUser?: number;
}

@ObjectType()
export class DataGenProgress {
  @Field(() => String) output: string;
  @Field(() => SubscriptionStatus) overallStatus: SubscriptionStatus;
}
