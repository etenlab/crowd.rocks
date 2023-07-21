import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordModule } from '../words/words.module';
import { PhraseModule } from '../phrases/phrases.module';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';
import { DefinitionsService } from './definitions.service';

import { DefinitionsResolver } from './definitions.resolver';

@Module({
  imports: [forwardRef(() => CoreModule), WordModule, PhraseModule],
  providers: [
    DefinitionsResolver,
    PhraseDefinitionsService,
    DefinitionsService,
    WordDefinitionsService,
  ],
  exports: [
    WordDefinitionsService,
    PhraseDefinitionsService,
    DefinitionsService,
  ],
})
export class DefinitionsModule {}
