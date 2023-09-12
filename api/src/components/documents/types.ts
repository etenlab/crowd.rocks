import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from '../../common/types';
import { LanguageInput } from '../common/types';

@ObjectType()
export class TextyDocumentOutput {
  @Field(() => ID) document_id: string;
  @Field(() => String) file_id: string;
  @Field(() => String) file_name: string;
  @Field(() => String) file_url: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code?: string;
  @Field(() => String, { nullable: true }) geo_code?: string;
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
  @Field(() => [TextyDocumentOutput], { nullable: true })
  documents: TextyDocumentOutput[] | null;
}
@InputType()
export class GetDocumentInput {
  @Field(() => String) document_id: string;
}
@ObjectType()
export class GetDocumentOutput extends GenericOutput {
  @Field(() => TextyDocumentOutput, { nullable: true })
  document: TextyDocumentOutput | null;
}
