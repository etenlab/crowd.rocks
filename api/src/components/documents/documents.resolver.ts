import { Injectable } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ErrorType } from '../../common/types';
import { getBearer } from '../../common/utility';

import { AuthenticationService } from '../authentication/authentication.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { DocumentsService } from './documents.service';
import {
  DocumentUploadInput,
  DocumentUploadOutput,
  DocumentWordEntriesOutput,
  GetAllDocumentsInput,
  GetAllDocumentsOutput,
  GetDocumentInput,
  GetDocumentOutput,
} from './types';

@Injectable()
@Resolver()
export class DocumentsResolver {
  constructor(
    private authenticationService: AuthenticationService,
    private documentsSevice: DocumentsService,
    private documentWordEntriesService: DocumentWordEntriesService,
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

    return this.documentsSevice.saveDocument({
      document: input.document,
      token: getBearer(req) || '',
    });
  }

  @Query(() => GetAllDocumentsOutput)
  async getAllDocuments(
    @Args('input') input: GetAllDocumentsInput,
  ): Promise<GetAllDocumentsOutput> {
    const res = await this.documentsSevice.getAllDocuments(input.lang);
    return res;
  }

  @Query(() => GetDocumentOutput)
  async getDocument(
    @Args('input') input: GetDocumentInput,
  ): Promise<GetDocumentOutput> {
    const res = await this.documentsSevice.getDocument(input.document_id);
    return res;
  }

  @Query(() => DocumentWordEntriesOutput)
  async getDocumentWordEntriesByDocumentId(
    @Args('document_id') document_id: string,
  ): Promise<DocumentWordEntriesOutput> {
    return this.documentWordEntriesService.getDocumentWordEntriesByDocumentId(
      +document_id,
      null,
    );
  }
}
