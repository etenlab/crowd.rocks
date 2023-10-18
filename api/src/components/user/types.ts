import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class User {
  @Field(() => ID) user_id: string;
  @Field() avatar: string;
  @Field(() => String, { nullable: true }) readonly avatar_url: string | null;
  @Field(() => Boolean) is_bot: boolean;
}

@InputType()
export class AvatarUpdateInput {
  @Field() avatar: string;
}

@ObjectType()
export class AvatarUpdateOutput extends GenericOutput {
  @Field(() => User, { nullable: true }) user: User | null;
}

@InputType()
export class UserReadInput {
  @Field(() => ID) user_id: string;
}

@ObjectType()
export class UserReadOutput extends GenericOutput {
  @Field(() => User, { nullable: true }) user: User | null;
}

@InputType()
export class FileUploadUrlRequest {
  @Field(() => ID) user_id: string;
}

@ObjectType()
export class FileUploadUrlResponse extends GenericOutput {
  @Field(() => String) url: string | null;
  @Field(() => String) avatar_image_url: string | null;
}
