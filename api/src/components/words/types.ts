import { Field, ID, InputType, ObjectType, Int } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Word {
  @Field(() => ID) word_id: string;
  @Field(() => String) word: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}
@ObjectType()
export class WordWithDefinition extends Word {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}
@ObjectType()
export class WordWithVotes extends WordWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}
@ObjectType()
export class WordTranslations extends WordWithDefinition {
  @Field(() => [WordWithVotes], { nullable: true })
  translations?: WordWithVotes[];
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
  word_vote: WordVote;
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
  vote_status: WordVoteStatus;
}

@ObjectType()
export class WordWithVote extends Word {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordWithDefinitionlikeStrings extends WordWithVote {
  @Field(() => [String], { nullable: 'items' })
  definitionlike_strings: string[];
}

@ObjectType()
export class WordWithVoteListOutput extends GenericOutput {
  @Field(() => [WordWithDefinitionlikeStrings], { nullable: 'items' })
  word_with_vote_list: WordWithDefinitionlikeStrings[];
}

@ObjectType()
export class WordWithVoteOutput extends GenericOutput {
  @Field(() => WordWithVote, { nullable: true })
  word_with_vote: WordWithVote | null;
}
