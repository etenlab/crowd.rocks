import { Field, ID, Int, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from '../../common/types';
import { PageInfo } from '../common/types';

import { WordlikeString } from '../words/types';

@ObjectType()
export class TextyDocument {
  @Field(() => ID) document_id: string;
  @Field(() => String) file_id: string;
  @Field(() => String) file_name: string;
  @Field(() => String) file_url: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
  @Field(() => String) created_by: string;
}

@ObjectType()
export class DocumentWordEntry {
  @Field(() => ID) document_word_entry_id: string;
  @Field(() => String) document_id: string;
  @Field(() => WordlikeString) wordlike_string: WordlikeString;
  @Field(() => String, { nullable: true })
  parent_document_word_entry_id: string | null;
  @Field(() => Int) page: number;
}

@ObjectType()
export class WordRange {
  @Field(() => ID) word_range_id: string;
  @Field(() => DocumentWordEntry) begin: DocumentWordEntry;
  @Field(() => DocumentWordEntry) end: DocumentWordEntry;
}

@InputType()
export class TextyDocumentInput {
  @Field(() => String) file_id: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class DocumentUploadOutput extends GenericOutput {
  @Field(() => TextyDocument, { nullable: true })
  document?: TextyDocument | null;
}

@InputType()
export class DocumentUploadInput {
  @Field(() => TextyDocumentInput) document: TextyDocumentInput;
}

@ObjectType()
export class DocumentEdge {
  @Field(() => ID) cursor: string;
  @Field(() => TextyDocument) node: TextyDocument;
}

@ObjectType()
export class DocumentListConnection extends GenericOutput {
  @Field(() => [DocumentEdge])
  edges: DocumentEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@InputType()
export class GetDocumentInput {
  @Field(() => String) document_id: string;
}

@ObjectType()
export class GetDocumentOutput extends GenericOutput {
  @Field(() => TextyDocument, { nullable: true })
  document: TextyDocument | null;
}

@ObjectType()
export class DocumentWordEntriesOutput extends GenericOutput {
  @Field(() => [DocumentWordEntry], { nullable: 'items' })
  document_word_entries: (DocumentWordEntry | null)[];
}

@ObjectType()
export class DocumentWordEntriesEdge {
  @Field(() => ID) cursor: string;
  @Field(() => [DocumentWordEntry]) node: DocumentWordEntry[];
}

@ObjectType()
export class DocumentWordEntriesListConnection extends GenericOutput {
  @Field(() => [DocumentWordEntriesEdge])
  edges: DocumentWordEntriesEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class WordRangesOutput extends GenericOutput {
  @Field(() => [WordRange], { nullable: 'items' })
  word_ranges: (WordRange | null)[];
}

@ObjectType()
export class WordRangesEdge {
  @Field(() => ID) cursor: string;
  @Field(() => [WordRange]) node: WordRange[];
}

@ObjectType()
export class WordRangesListConnection extends GenericOutput {
  @Field(() => [WordRangesEdge])
  edges: WordRangesEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@InputType()
export class WordRangeInput {
  @Field(() => String) begin_document_word_entry_id: string;
  @Field(() => String) end_document_word_entry_id: string;
}

@ObjectType()
export class TextFromRange {
  @Field(() => String) piece_of_text: string;
  @Field(() => ID) begin_document_word_entry_id: string;
  @Field(() => ID) end_document_word_entry_id: string;
}

@ObjectType()
export class TextFromRangesOutput extends GenericOutput {
  @Field(() => [TextFromRange]) list: TextFromRange[];
}
