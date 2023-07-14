import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GenericOutput } from "src/common/types";

@ObjectType()
export class Version {
  @Field(type => ID) version_id: string
  @Field(type => Int) post_id: string
  @Field() created_at: string
  @Field() license_title: string
  @Field() content: string
} 

@ObjectType()
export class Post {
  @Field(type => ID) post_id: string
  @Field() created_at: string
  @Field(type => Int) created_by: number
}

@InputType()
export class PostCreateInput {
  @Field(type => String) content: string
  @Field(type => Int, { nullable: true }) parent_id: number | null
}

@ObjectType()
export class PostCreateOutput extends GenericOutput {
  @Field(type => Post, { nullable: true }) post: Post | null
}

@InputType()
export class PostReadInput {
  @Field(type => ID) post_id: string
} 

@ObjectType()
export class PostReadOutput extends GenericOutput {
  @Field(type => Post, { nullable: true }) post: Post | null
}

@InputType()
export class VersionCreateInput {
  @Field(type => Int) post_id: number
  @Field(type => String) license_title: string
  @Field() content: string
}

@ObjectType()
export class VersionCreateOutput extends GenericOutput {
  @Field(type => Version, { nullable: true }) version: Version | null
}