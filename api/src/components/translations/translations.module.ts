import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';

import { TranslationsResolver } from './translations.resolver';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';
import { WordsModule } from '../words/words.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { WordToWordTranslationRepository } from './word-to-word-translation.repository';
import { MapsModule } from '../maps/maps.module';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    DefinitionsModule,
    WordsModule,
    AuthenticationModule,
    forwardRef(() => MapsModule),
  ],
  providers: [
    TranslationsResolver,
    WordToWordTranslationsService,
    WordToPhraseTranslationsService,
    PhraseToPhraseTranslationsService,
    WordToWordTranslationRepository,
  ],
  exports: [
    WordToWordTranslationsService,
    WordToPhraseTranslationsService,
    PhraseToPhraseTranslationsService,
  ],
})
export class TranslationsModule {}
