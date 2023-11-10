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
}

@ObjectType()
export class DataGenProgress {
  @Field(() => String) output: string;
  @Field(() => SubscriptionStatus) mapUploadStatus: SubscriptionStatus;
  @Field(() => SubscriptionStatus) mapTranslationsStatus: SubscriptionStatus;
  @Field(() => SubscriptionStatus) mapReTranslationsStatus: SubscriptionStatus;
  @Field(() => SubscriptionStatus) userCreateStatus: SubscriptionStatus;
  @Field(() => SubscriptionStatus) overallStatus: SubscriptionStatus;
}
