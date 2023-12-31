import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';

import { WordsResolver } from './words.resolver';
import { WordsService } from './words.service';
import { WordVotesService } from './word-votes.service';
import { WordlikeStringsService } from './wordlike-strings.service';

@Module({
  imports: [forwardRef(() => CoreModule), forwardRef(() => DefinitionsModule)],
  providers: [
    WordsService,
    WordVotesService,
    WordlikeStringsService,
    WordsResolver,
  ],
  exports: [WordsService, WordVotesService, WordlikeStringsService],
})
export class WordsModule {}
