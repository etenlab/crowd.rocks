import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordsModule } from '../words/words.module';
import { PhraseModule } from '../phrases/phrases.module';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';
import { DefinitionsService } from './definitions.service';
import { WordDefinitionVotesService } from './word-definition-votes.service';
import { PhraseDefinitionVotesService } from './phrase-definition-votes.service';

import { DefinitionsResolver } from './definitions.resolver';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => WordsModule),
    forwardRef(() => PhraseModule),
  ],
  providers: [
    DefinitionsResolver,
    PhraseDefinitionsService,
    DefinitionsService,
    WordDefinitionsService,
    WordDefinitionVotesService,
    PhraseDefinitionVotesService,
  ],
  exports: [
    WordDefinitionsService,
    PhraseDefinitionsService,
    DefinitionsService,
    WordDefinitionVotesService,
    PhraseDefinitionVotesService,
  ],
})
export class DefinitionsModule {}
