import { Field, ID, InputType, ObjectType, Int } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { WordDefinition } from 'src/components/definitions/types';
import { PageInfo } from 'src/components/common/types';

@ObjectType()
export class Word {
  @Field(() => ID) word_id: string;
  @Field(() => String) word: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@InputType()
export class WordUpsertInput {
  @Field(() => String) wordlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code?: string | null;
  @Field(() => String, { nullable: true }) geo_code?: string | null;
}

@ObjectType()
export class WordUpsertOutput extends GenericOutput {
  @Field(() => Word, { nullable: true }) word: Word | null;
}

@InputType()
export class WordReadInput {
  @Field(() => ID) word_id: string;
}

@ObjectType()
export class WordReadOutput extends GenericOutput {
  @Field(() => Word, { nullable: true }) word: Word | null;
}

@ObjectType()
export class WordVote {
  @Field(() => ID) words_vote_id: string;
  @Field(() => ID) word_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class WordVoteOutput extends GenericOutput {
  @Field(() => WordVote, { nullable: true })
  word_vote: WordVote | null;
}

@InputType()
export class WordVoteUpsertInput {
  @Field(() => ID) word_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordVoteStatus {
  @Field(() => ID) word_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordVoteStatus, { nullable: true })
  vote_status: WordVoteStatus | null;
}

@ObjectType()
export class WordWithVote extends Word {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordWithDefinitions extends WordWithVote {
  @Field(() => [WordDefinition], { nullable: 'items' })
  definitions: WordDefinition[];
}

@ObjectType()
export class WordWithVoteListEdge {
  @Field(() => ID) cursor: string;
  @Field(() => WordWithDefinitions) node: WordWithDefinitions;
}

@ObjectType()
export class WordWithVoteListConnection extends GenericOutput {
  @Field(() => [WordWithVoteListEdge]) edges: WordWithVoteListEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class WordWithVoteOutput extends GenericOutput {
  @Field(() => WordWithVote, { nullable: true })
  word_with_vote: WordWithVote | null;
}
