import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordsModule } from 'src/components/words/words.module';
import { DefinitionsModule } from '../definitions/definitions.module';

import { PhrasesResolver } from './phrases.resolver';
import { PhrasesService } from './phrases.service';
import { PhraseVotesService } from './phrase-votes.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => DefinitionsModule),
    forwardRef(() => WordsModule),
  ],
  providers: [PhrasesResolver, PhrasesService, PhraseVotesService],
  exports: [PhrasesService, PhraseVotesService],
})
export class PhraseModule {}
