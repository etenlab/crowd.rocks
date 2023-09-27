import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from '../../common/types';
import { LanguageInput } from '../common/types';

import { WordlikeString } from '../words/types';

@ObjectType()
export class TextyDocument {
  @Field(() => ID) document_id: string;
  @Field(() => String) file_id: string;
  @Field(() => String) file_name: string;
  @Field(() => String) file_url: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code?: string;
  @Field(() => String, { nullable: true }) geo_code?: string;
}

@ObjectType()
export class DocumentWordEntry {
  @Field(() => ID) document_word_entry_id: string;
  @Field(() => String) document_id: string;
  @Field(() => WordlikeString) wordlike_string: WordlikeString;
  @Field(() => WordlikeString, { nullable: true })
  parent_wordlike_string: WordlikeString | null;
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
  @Field(() => String, { nullable: true }) dialect_code?: string;
  @Field(() => String, { nullable: true }) geo_code?: string;
}

@ObjectType()
export class DocumentUploadOutput extends GenericOutput {
  @Field(() => String, { nullable: true })
  document_id?: string | null | undefined;
}

@InputType()
export class DocumentUploadInput {
  @Field(() => TextyDocumentInput) document: TextyDocumentInput;
}

@InputType()
export class GetAllDocumentsInput {
  @Field(() => LanguageInput, { nullable: true }) lang?: LanguageInput;
}

@ObjectType()
export class GetAllDocumentsOutput extends GenericOutput {
  @Field(() => [TextyDocument], { nullable: true })
  documents: TextyDocument[] | null;
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
  @Field(() => [DocumentWordEntry], { nullable: true })
  document_word_entries: (DocumentWordEntry | null)[];
}

@ObjectType()
export class WordRangesOutput extends GenericOutput {
  @Field(() => [WordRange], { nullable: true })
  word_ranges: (WordRange | null)[];
}

@InputType()
export class WordRangeUpsertInput {
  @Field(() => String) begin_document_word_entry_id: string;
  @Field(() => String) end_document_word_entry_id: string;
}
