import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { AuthenticationModule } from '../authentication/authentication.module';
import { FileModule } from '../file/file.module';
import { WordsModule } from '../words/words.module';

import { DocumentsResolver } from './documents.resolver';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';
import { DocumentWordEntriesService } from './document-word-entries.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => WordsModule),
    FileModule,
  ],
  providers: [
    DocumentsResolver,
    DocumentsService,
    DocumentWordEntriesService,
    DocumentsRepository,
  ],
  exports: [DocumentsService, DocumentWordEntriesService],
})
export class DocumentsModule {}
