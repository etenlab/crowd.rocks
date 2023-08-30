import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';

import { ForumsResolver } from './words.resolver';
import { WordsService } from './words.service';
import { WordVotesService } from './word-votes.service';

@Module({
  imports: [forwardRef(() => CoreModule), forwardRef(() => DefinitionsModule)],
  providers: [WordsService, WordVotesService, ForumsResolver],
  exports: [WordsService, WordVotesService],
})
export class WordsModule {}
