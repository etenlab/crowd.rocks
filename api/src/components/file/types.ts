import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';

@ObjectType()
export class IFile {
  @Field(() => Int)
  id: number;

  @Field()
  fileName: string;

  @Field(() => Int)
  fileSize: number;

  @Field()
  fileType: string;

  @Field()
  fileUrl: string;

  @Field()
  fileHash: string;
}

@ObjectType()
export class IFileOutput {
  @Field(() => IFile, { nullable: true }) file: IFile | null;
  @Field(() => ErrorType) error: ErrorType;
}
export class IFileDeleteOutput {
  @Field(() => String, { nullable: true }) deletedId: string | null;
  @Field(() => ErrorType) error: ErrorType;
}

@ObjectType()
export class GetFileListOutput {
  @Field(() => [IFile]) fileList: IFile[];
}
