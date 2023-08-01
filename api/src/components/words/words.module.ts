import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { WordsResolver } from './words.resolver';
import { WordsService } from './words.service';
import { WordVotesService } from './word-votes.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [WordsService, WordVotesService, WordsResolver],
  exports: [WordsService, WordVotesService],
})
export class WordsModule {}
