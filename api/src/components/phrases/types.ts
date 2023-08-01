import { Field, ID, InputType, ObjectType, Int } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Phrase {
  @Field(() => ID) phrase_id: string;
  @Field(() => String) phrase: string;
}

@InputType()
export class PhraseUpsertInput {
  @Field(() => String) phraselike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class PhraseUpsertOutput extends GenericOutput {
  @Field(() => Phrase, { nullable: true }) phrase: Phrase | null;
}

@InputType()
export class PhraseReadInput {
  @Field(() => ID) phrase_id: string;
}

@ObjectType()
export class PhraseReadOutput extends GenericOutput {
  @Field(() => Phrase, { nullable: true }) phrase: Phrase | null;
}

@ObjectType()
export class PhraseVote {
  @Field(() => ID) phrase_vote_id: string;
  @Field(() => ID) phrase_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class PhraseVoteOutput extends GenericOutput {
  @Field(() => PhraseVote, { nullable: true })
  phrase_vote: PhraseVote;
}

@InputType()
export class PhraseVoteUpsertInput {
  @Field(() => ID) phrase_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class PhraseVoteStatus {
  @Field(() => ID) phrase_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PhraseVoteStatusOutputRow extends GenericOutput {
  @Field(() => PhraseVoteStatus, { nullable: true })
  vote_status: PhraseVoteStatus;
}
