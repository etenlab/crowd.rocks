import { Module, forwardRef } from '@nestjs/common';

import { ConfigService } from './config.service';
import { DataLoadService } from './data-load.service';
import { DatabaseVersionControlService } from './database-version-control.service';
import { PostgresService } from './postgres.service';
import { S3Service } from './s3.service';
import { SesService } from './ses.service';

import { PhraseModule } from 'src/components/phrases/phrases.module';
import { WordModule } from 'src/components/words/words.module';

@Module({
  imports: [forwardRef(() => PhraseModule), forwardRef(() => WordModule)],
  providers: [
    PostgresService,
    DataLoadService,
    DatabaseVersionControlService,
    ConfigService,
    SesService,
    S3Service,
  ],
  exports: [
    PostgresService,
    DataLoadService,
    DatabaseVersionControlService,
    ConfigService,
    SesService,
    S3Service,
  ],
})
export class CoreModule {}
