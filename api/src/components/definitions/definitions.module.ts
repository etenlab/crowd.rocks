import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordModule } from '../words/words.module';
import { PhraseModule } from '../phrases/phrases.module';

import { WordDefinitionsResolver } from './word-definitions.resolver';
import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsResolver } from './phrase-definitions.resolver';
import { PhraseDefinitionsService } from './phrase-definitions.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => WordModule),
    forwardRef(() => PhraseModule),
  ],
  providers: [
    WordDefinitionsResolver,
    WordDefinitionsService,
    PhraseDefinitionsResolver,
    PhraseDefinitionsService,
  ],
  exports: [WordDefinitionsService, PhraseDefinitionsService],
})
export class DefinitionsModule {}
