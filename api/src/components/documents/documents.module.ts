import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { AuthenticationModule } from '../authentication/authentication.module';
import { FileModule } from '../file/file.module';
import { WordsModule } from '../words/words.module';

import { DocumentsResolver } from './documents.resolver';
import { DocumentsService } from './documents.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { WordRangesService } from './word-ranges.service';
import { AuthorizationModule } from '../authorization/authorization.module';
import { AuthorizationService } from '../authorization/authorization.service';
import { DocumentTranslateService } from './document-translation.service';
import { PericopeTrModule } from '../pericope-translations/pericope-tr.module';
import { PericopiesModule } from '../pericopies/pericopies.module';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => WordsModule),
    forwardRef(() => AuthorizationModule),
    forwardRef(() => PericopeTrModule),
    forwardRef(() => PericopiesModule),
    forwardRef(() => DocumentsModule),
    FileModule,
  ],
  providers: [
    DocumentsService,
    DocumentWordEntriesService,
    WordRangesService,
    DocumentsResolver,
    AuthorizationService,
    DocumentTranslateService,
  ],
  exports: [DocumentsService, DocumentWordEntriesService, WordRangesService],
})
export class DocumentsModule {}
