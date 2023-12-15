import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { WordRange } from 'src/components/documents/types';
import { PageInfo } from '../common/types';

@ObjectType()
export class WordRangeTag {
  @Field(() => ID) word_range_tag_id: string;
  @Field(() => WordRange) word_range: WordRange;
  @Field(() => String) tag_name: string;
}

@ObjectType()
export class WordRangeTagWithVote extends WordRangeTag {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordRangeTagsOutput extends GenericOutput {
  @Field(() => [WordRangeTag], { nullable: 'items' })
  word_range_tags: (WordRangeTag | null)[];
}

@ObjectType()
export class WordRangeTagWithVotesOutput extends GenericOutput {
  @Field(() => [WordRangeTagWithVote], { nullable: 'items' })
  word_range_tags: (WordRangeTagWithVote | null)[];
}

@ObjectType()
export class WordRangeTagVoteStatus {
  @Field(() => ID) word_range_tag_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordRangeTagVoteStatusListOutput extends GenericOutput {
  @Field(() => [WordRangeTagVoteStatus])
  vote_status_list: WordRangeTagVoteStatus[];
}

@ObjectType()
export class WordRangeTagVoteStatusOutput extends GenericOutput {
  @Field(() => WordRangeTagVoteStatus, { nullable: true })
  vote_status: WordRangeTagVoteStatus | null;
}

@ObjectType()
export class WordRangeTagsEdge {
  @Field(() => ID) cursor: string;
  @Field(() => [WordRangeTagWithVote]) node: WordRangeTagWithVote[];
}

@ObjectType()
export class WordRangeTagsListConnection extends GenericOutput {
  @Field(() => [WordRangeTagsEdge])
  edges: WordRangeTagsEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}
