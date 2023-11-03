import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionStatus } from 'src/common/types';
import { LanguageInput } from '../common/types';

@ObjectType()
export class Populator {
  @Field(() => ID) id: string;
}

@InputType()
export class DataGenInput {
  @Field(() => Int) mapAmount: number;
  @Field(() => [LanguageInput]) mapsToLanguages: LanguageInput[];
}

@ObjectType()
export class DataGenProgress {
  @Field(() => String) mapUpload: string;
  @Field(() => SubscriptionStatus) mapUploadStatus: SubscriptionStatus;
  @Field(() => SubscriptionStatus) mapTranslationsStatus: SubscriptionStatus;
}
