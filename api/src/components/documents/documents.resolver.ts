import { Injectable } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver, ID } from '@nestjs/graphql';

import { ErrorType } from '../../common/types';
import { getBearer } from '../../common/utility';

import { AuthenticationService } from '../authentication/authentication.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { DocumentsService } from './documents.service';
import { WordRangesService } from './word-ranges.service';

import {
  DocumentUploadInput,
  DocumentUploadOutput,
  DocumentWordEntriesOutput,
  GetAllDocumentsInput,
  GetAllDocumentsOutput,
  GetDocumentInput,
  GetDocumentOutput,
  WordRangesOutput,
  WordRangeUpsertInput,
} from './types';

@Injectable()
@Resolver()
export class DocumentsResolver {
  constructor(
    private authenticationService: AuthenticationService,
    private documentsSevice: DocumentsService,
    private documentWordEntriesService: DocumentWordEntriesService,
    private wordRangesService: WordRangesService,
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
    @Args('document_id', { type: () => ID }) document_id: string,
  ): Promise<DocumentWordEntriesOutput> {
    return this.documentWordEntriesService.getDocumentWordEntriesByDocumentId(
      +document_id,
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async readWordRanges(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<WordRangesOutput> {
    console.log('readWordRanges, ids:', ids);

    return this.wordRangesService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async getWordRangesByBeginIds(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<WordRangesOutput> {
    console.log('getWordRangesByBeginIds, ids:', ids);

    return this.wordRangesService.getByBeginWordIds(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async getWordRangesByDocumentId(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordRangesOutput> {
    console.log('getWordRangesByDocumentId, id:', id);

    return this.wordRangesService.getByDocumentId(+id, null);
  }

  @Mutation(() => WordRangesOutput)
  async upsertWordRanges(
    @Args('input', { type: () => [WordRangeUpsertInput] })
    input: WordRangeUpsertInput[],
    @Context() req: any,
  ): Promise<WordRangesOutput> {
    console.log('upsertWordRanges: ', JSON.stringify(input, null, 2));

    return this.wordRangesService.upserts(input, getBearer(req) || '', null);
  }
}
