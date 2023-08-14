import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Version {
  @Field(() => ID) version_id: string;
  @Field(() => Int) post_id: string;
  @Field() created_at: string;
  @Field() license_title: string;
  @Field() content: string;
}

@ObjectType()
export class Post {
  @Field(() => ID) post_id: string;
  @Field() created_at: string;
  @Field(() => Int) created_by: number;
}

@InputType()
export class PostCreateInput {
  @Field(() => String) content: string;
  @Field(() => Int, { nullable: true }) parent_id: number | null;
}

@ObjectType()
export class PostCreateOutput extends GenericOutput {
  @Field(() => Post, { nullable: true }) post: Post | null;
}

@InputType()
export class PostReadInput {
  @Field(() => ID) post_id: string;
}

@ObjectType()
export class PostReadOutput extends GenericOutput {
  @Field(() => Post, { nullable: true }) post: Post | null;
}

@InputType()
export class VersionCreateInput {
  @Field(() => Int) post_id: number;
  @Field(() => String) license_title: string;
  @Field() content: string;
}

@ObjectType()
export class VersionCreateOutput extends GenericOutput {
  @Field(() => Version, { nullable: true }) version: Version | null;
}
