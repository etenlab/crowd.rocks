import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql'
import { ErrorType, GenericOutput } from 'src/common/types'

@ObjectType()
export class User {
  @Field((type) => ID) user_id: string
  @Field() avatar: string
  @Field((type) => String, { nullable: true }) readonly avatar_url: string | null
}

@InputType()
export class AvatarUpdateInput {
  @Field() avatar: string
}

@ObjectType()
export class AvatarUpdateOutput extends GenericOutput {
  @Field((type) => User, { nullable: true }) user: User | null
}

@InputType()
export class UserReadInput {
  @Field((type) => ID) user_id: string
}

@ObjectType()
export class UserReadOutput extends GenericOutput {
  @Field((type) => User, { nullable: true }) user: User | null
}

@InputType()
export class FileUploadUrlRequest {
  @Field((type) => ID) user_id: string
}

@ObjectType()
export class FileUploadUrlResponse extends GenericOutput {
  @Field((type) => String) url: string | null
  @Field((type) => String) avatar_image_url: string | null
}