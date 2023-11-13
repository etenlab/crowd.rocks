import { Injectable, Logger } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  ID,
} from '@nestjs/graphql';

import { ErrorType } from '../../common/types';
import { getBearer } from '../../common/utility';

import { AuthenticationService } from '../authentication/authentication.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { DocumentsService } from './documents.service';
import { WordRangesService } from './word-ranges.service';

import {
  DocumentUploadInput,
  DocumentUploadOutput,
  DocumentWordEntriesListConnection,
  DocumentListConnection,
  GetDocumentInput,
  GetDocumentOutput,
  WordRangesOutput,
  WordRangeUpsertInput,
} from './types';
import { LanguageInput } from '../common/types';

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
    Logger.log('documentUpload', JSON.stringify(input, null, 2));

    if (!this.authenticationService.isAdmin(getBearer(req) || '')) {
      return {
        error: ErrorType.Unauthorized,
        document: null,
      };
    }

    return this.documentsSevice.saveDocument({
      document: input.document,
      token: getBearer(req) || '',
    });
  }

  @Query(() => DocumentListConnection)
  async getAllDocuments(
    @Args('input', { type: () => LanguageInput, nullable: true })
    input: LanguageInput | null,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<DocumentListConnection> {
    Logger.log(
      'getAllDocuments',
      JSON.stringify(
        {
          lang: input,
          after,
          first,
        },
        null,
        2,
      ),
    );

    const res = await this.documentsSevice.getAllDocuments({
      lang: input,
      after,
      first,
    });
    return res;
  }

  @Query(() => GetDocumentOutput)
  async getDocument(
    @Args('input') input: GetDocumentInput,
  ): Promise<GetDocumentOutput> {
    Logger.log('getDocument', JSON.stringify(input, null, 2));

    return this.documentsSevice.getDocument(+input.document_id);
  }

  @Query(() => DocumentWordEntriesListConnection)
  async getDocumentWordEntriesByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<DocumentWordEntriesListConnection> {
    Logger.log(
      'getDocument',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.documentWordEntriesService.getDocumentWordEntriesByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async readWordRanges(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<WordRangesOutput> {
    Logger.log('readWordRanges, ids:', ids);

    return this.wordRangesService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async getWordRangesByBeginIds(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<WordRangesOutput> {
    Logger.log('getWordRangesByBeginIds, ids:', ids);

    return this.wordRangesService.getByBeginWordIds(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => WordRangesOutput)
  async getWordRangesByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
  ): Promise<WordRangesOutput> {
    Logger.log('getWordRangesByDocumentId, id:', document_id);

    return this.wordRangesService.getByDocumentId(+document_id, null);
  }

  @Mutation(() => WordRangesOutput)
  async upsertWordRanges(
    @Args('input', { type: () => [WordRangeUpsertInput] })
    input: WordRangeUpsertInput[],
    @Context() req: any,
  ): Promise<WordRangesOutput> {
    Logger.log('upsertWordRanges: ', JSON.stringify(input, null, 2));

    return this.wordRangesService.upserts(input, getBearer(req) || '', null);
  }
}
