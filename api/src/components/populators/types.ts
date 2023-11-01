import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Populator {
  @Field(() => ID) id: string;
}
