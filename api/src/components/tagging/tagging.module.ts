import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';

import { WordRangeTagsService } from './word-range-tags.service';
import { WordRangeTagVotesService } from './word-range-tag-votes.service';
import { TaggingsResolver } from './tagging.resolver';

import { DocumentsModule } from '../documents/documents.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => DocumentsModule),
    forwardRef(() => AuthorizationModule),
  ],
  providers: [WordRangeTagsService, WordRangeTagVotesService, TaggingsResolver],
  exports: [WordRangeTagsService, WordRangeTagVotesService],
})
export class TaggingsModule {}
