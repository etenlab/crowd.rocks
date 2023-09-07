import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
  Context,
} from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { IFile, IFileOutput } from './types';
import { getBearer } from 'src/common/utility';

@ObjectType()
export class FileDecoratorsGQL {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  fileName: string;

  @Field(() => Int)
  fileSize: number;

  @Field(() => String)
  fileType: string;

  @Field(() => String)
  fileUrl: string;

  @Field(() => String)
  fileHash: string;
}

@Resolver(() => IFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => IFileOutput)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: file_name }: FileUpload,
    @Args({ name: 'file_type', type: () => String }) file_type: string,
    @Args({ name: 'file_size', type: () => Int }) file_size: number,
    @Context() req: any,
  ): Promise<IFileOutput> {
    const bearer = getBearer(req) || '';
    const file = await this.fileService.uploadFile(
      createReadStream(),
      file_name,
      file_type,
      file_size,
      bearer,
    );
    console.log('[file]:', JSON.stringify(file));
    return file!;
  }

  @Mutation(() => IFileOutput)
  async updateFile(
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    { createReadStream, filename: file_name }: FileUpload,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'file_type', type: () => String, nullable: true })
    file_type: string,
    @Args({ name: 'file_size', type: () => Int, nullable: true })
    file_size: number,
    @Context() req: any,
  ): Promise<IFileOutput> {
    const bearer = getBearer(req) || '';
    const file = await this.fileService.updateFile(
      createReadStream(),
      id,
      file_name,
      file_type,
      file_size,
      bearer,
    );
    return file!;
  }

  @Query(() => [IFile], { name: 'fileList' })
  async getAll() {
    return await this.fileService.getAll();
  }

  @Query(() => IFileOutput, { name: 'file' })
  async findOne(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.fileService.findOne(id);
  }
}
