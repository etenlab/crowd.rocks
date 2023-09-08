import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from '../../common/types';

@InputType()
export class TextyDocument {
  @Field(() => ID, { nullable: true }) document_id?: string;
  @Field(() => String) file_id: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code?: string;
  @Field(() => String, { nullable: true }) geo_code?: string;
  @Field(() => String, { nullable: true }) created_by?: string;
}

@ObjectType()
export class DocumentUploadOutput extends GenericOutput {
  @Field(() => String, { nullable: true })
  document_id?: string | null | undefined;
}

@InputType()
export class DocumentUploadInput {
  @Field(() => TextyDocument) document: TextyDocument;
}
