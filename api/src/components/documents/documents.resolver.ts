import { Injectable } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from '../../common/types';
import { getBearer } from '../../common/utility';
import { AuthenticationService } from '../authentication/authentication.service';
import { DocumentsService } from './documents.service';
import {
  DocumentUploadInput,
  DocumentUploadOutput,
  GetAllDocumentsInput,
  GetAllDocumentsOutput,
} from './types';

@Injectable()
  @Resolver()
export class DocumentsResolver {
  constructor(
    private authenticationService: AuthenticationService,
    private documentsSevice: DocumentsService,
  ) {}

  @Mutation(() => DocumentUploadOutput)
  async documentUpload(
    @Args('input') input: DocumentUploadInput,
    @Context() req: any,
  ): Promise<DocumentUploadOutput> {
    if (!this.authenticationService.isAdmin(getBearer(req) || '')) {
      return {
        error: ErrorType.Unauthorized,
        document_id: null,
      };
    }
    const document_id = await this.documentsSevice.saveDocument({
      document: input.document,
      token: getBearer(req) || '',
    });

    return {
      error: ErrorType.NoError,
      document_id,
    };
  }

  @Query(() => GetAllDocumentsOutput)
  async getAllDocuments(
    @Args('input') input: GetAllDocumentsInput,
  ): Promise<GetAllDocumentsOutput> {
    const res = await this.documentsSevice.getAllDocuments(input.lang);
    return res;
  }
}
