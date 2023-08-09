import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from 'src/components/authentication/authentication.module';
import { MapsModule } from 'src/components/maps/maps.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';
import { WordsModule } from 'src/components/words/words.module';
import { PhraseModule } from 'src/components/phrases/phrases.module';

import { TranslationsResolver } from './translations.resolver';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { TranslationsService } from './translations.service';

import { WordToWordTranslationRepository } from './word-to-word-translation.repository';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    DefinitionsModule,
    WordsModule,
    PhraseModule,
    AuthenticationModule,
    forwardRef(() => MapsModule),
  ],
  providers: [
    TranslationsResolver,
    WordToWordTranslationRepository,
    WordToWordTranslationsService,
    WordToPhraseTranslationsService,
    PhraseToWordTranslationsService,
    PhraseToPhraseTranslationsService,
    TranslationsService,
  ],
  exports: [
    WordToWordTranslationsService,
    WordToPhraseTranslationsService,
    PhraseToWordTranslationsService,
    PhraseToPhraseTranslationsService,
    TranslationsService,
  ],
})
export class TranslationsModule {}
