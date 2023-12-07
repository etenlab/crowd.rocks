import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  ID,
  Query,
  Mutation,
  Subscription,
  Resolver,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from 'src/common/subscription-token';
import { PUB_SUB } from 'src/pubSub.module';

import { ErrorType } from '../../common/types';
import { getBearer } from '../../common/utility';

import { AuthenticationService } from '../authentication/authentication.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { DocumentsService } from './documents.service';
import { WordRangesService } from './word-ranges.service';

import {
  TextFromRangesOutput,
  DocumentUploadInput,
  DocumentUploadOutput,
  DocumentWordEntriesListConnection,
  DocumentListConnection,
  GetDocumentInput,
  GetDocumentOutput,
  WordRangesOutput,
  WordRangeInput,
  WordRangesListConnection,
  TranslateDocumentByPericopiesInput,
  FileUrlOutput,
} from './types';
import { LanguageInput } from '../common/types';
import { DocumentTranslateService } from './document-translation.service';

@Injectable()
@Resolver()
export class DocumentsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private authenticationService: AuthenticationService,
    private documentsSevice: DocumentsService,
    private documentWordEntriesService: DocumentWordEntriesService,
    private wordRangesService: WordRangesService,
    private documentTranslateService: DocumentTranslateService,
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

    const newDocument = await this.documentsSevice.saveDocument({
      document: input.document,
      token: getBearer(req) || '',
    });

    this.pubSub.publish(SubscriptionToken.documentAdded, {
      [SubscriptionToken.documentAdded]: newDocument,
    });

    return newDocument;
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
      'getDocumentWordEntriesByDocumentId',
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

  @Query(() => WordRangesListConnection)
  async getWordRangesByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<WordRangesListConnection> {
    Logger.log(
      'getWordRangesByDocumentId:',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.wordRangesService.getByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Query(() => TextFromRangesOutput)
  async getDocumentTextFromRanges(
    @Args('ranges', { type: () => [WordRangeInput] }) ranges: WordRangeInput[],
  ): Promise<TextFromRangesOutput> {
    Logger.log('getDocumentTextFromRange:', JSON.stringify(ranges, null, 2));

    return this.wordRangesService.getTextFromRanges(ranges, null);
  }

  @Mutation(() => WordRangesOutput)
  async upsertWordRanges(
    @Args('input', { type: () => [WordRangeInput] })
    input: WordRangeInput[],
    @Context() req: any,
  ): Promise<WordRangesOutput> {
    Logger.log(
      'DocumentsResolver#upsertWordRanges: ',
      JSON.stringify(input, null, 2),
    );

    return this.wordRangesService.upserts(input, getBearer(req) || '', null);
  }

  @Mutation(() => FileUrlOutput)
  async documentByPericopiesTranslate(
    @Args('input', { type: () => TranslateDocumentByPericopiesInput })
    input: TranslateDocumentByPericopiesInput,
  ): Promise<FileUrlOutput> {
    Logger.log(
      'DocumentsResolver#documentByPericopiesTranslate: ',
      JSON.stringify(input, null, 2),
    );
    return this.documentTranslateService.translateByPericopies(
      input.documentId,
      input.targetLang,
    );
  }

  @Subscription(() => DocumentUploadOutput, {
    name: SubscriptionToken.documentAdded,
  })
  subscribeToDocumentAdded() {
    return this.pubSub.asyncIterator(SubscriptionToken.documentAdded);
  }
}
