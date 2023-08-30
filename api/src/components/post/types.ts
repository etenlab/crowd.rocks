import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { User } from '../user/types';

@ObjectType()
export class Version {
  @Field(() => ID) version_id: string;
  @Field(() => Int) post_id: string;
  @Field(() => Date) created_at: string;
  @Field() license_title: string;
  @Field() content: string;
}

@ObjectType()
export class Post {
  @Field(() => ID) post_id: string;
  @Field(() => Date) created_at: string;
  @Field(() => User) created_by_user: User;
  @Field(() => String) content: string;
}

@InputType()
export class PostCreateInput {
  @Field(() => String) content: string; //super simple with just one version content for now
  @Field(() => Int) parent_id: number;
  @Field(() => String) parent_table: string;
}

@ObjectType()
export class PostCreateOutput extends GenericOutput {
  @Field(() => Post, { nullable: true }) post: Post | null;
}

@InputType()
export class PostReadInput {
  @Field(() => ID) post_id: string;
}

@InputType()
export class PostsByParentInput {
  @Field(() => ID) parent_id: string;
  @Field(() => String) parent_name: string;
}

@ObjectType()
export class PostsByParentOutput extends GenericOutput {
  @Field(() => [Post], { nullable: true }) posts: Post[];
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
