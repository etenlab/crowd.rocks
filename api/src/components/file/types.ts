import { Field, ObjectType, Int, ID } from '@nestjs/graphql';

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
export class GetFileListOutput {
  @Field(() => [IFile]) fileList: IFile[];
}



