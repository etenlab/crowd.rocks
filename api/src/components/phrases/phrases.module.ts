import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordsModule } from 'src/components/words/words.module';

import { PhrasesResolver } from './phrases.resolver';
import { PhrasesService } from './phrases.service';

@Module({
  imports: [forwardRef(() => CoreModule), WordsModule],
  providers: [PhrasesResolver, PhrasesService],
  exports: [PhrasesService],
})
export class PhraseModule {}
