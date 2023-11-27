import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { PageInfo } from '../common/types';

@ObjectType()
export class Pericope {
  @Field(() => ID) pericope_id: string;
  @Field(() => String) start_word: string;
}

@ObjectType()
export class PericopeVote {
  @Field(() => ID) pericope_vote_id: string;
  @Field(() => ID) pericope_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class PericopeWithVote extends Pericope {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PericopeVoteStatus {
  @Field(() => ID) pericope_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PericopiesOutput extends GenericOutput {
  @Field(() => [Pericope], { nullable: 'items' })
  pericopies: (Pericope | null)[];
}

@ObjectType()
export class PericopeVotesOutput extends GenericOutput {
  @Field(() => [PericopeVote], { nullable: 'items' })
  pericope_votes: (PericopeVote | null)[];
}

@ObjectType()
export class PericopeVoteStatusListOutput extends GenericOutput {
  @Field(() => [PericopeVoteStatus])
  vote_status_list: PericopeVoteStatus[];
}

@ObjectType()
export class PericopeVoteStatusOutput extends GenericOutput {
  @Field(() => PericopeVoteStatus, { nullable: true })
  vote_status: PericopeVoteStatus | null;
}

@ObjectType()
export class PericopeWithVotesEdge {
  @Field(() => ID) cursor: string;
  @Field(() => [PericopeWithVote]) node: PericopeWithVote[];
}

@ObjectType()
export class PericopeWithVotesListConnection extends GenericOutput {
  @Field(() => [PericopeWithVotesEdge])
  edges: PericopeWithVotesEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

// minimalistic pericopies without splitting by pages and without votes
@ObjectType()
export class PericopeEdge {
  @Field(() => ID) cursor: string;
  @Field(() => Pericope) node: Pericope;
}

@ObjectType()
export class RecomendedPericopeConnection extends GenericOutput {
  @Field(() => [PericopeEdge])
  edges: PericopeEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class PericopeText extends GenericOutput {
  @Field(() => ID, { nullable: true }) pericope_id: string | null;
  @Field(() => String) pericope_text: string;
}
@ObjectType()
export class PericopeTextWithDescription extends PericopeText {
  @Field(() => String) pericope_description_text: string;
}
