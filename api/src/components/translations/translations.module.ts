import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { WordToWordTranslationResolver } from './word-to-word-translations.resolver';
import { WordToWordTranslationsService } from './word-to-word-translations.service';

import { WordToPhraseTranslationResolver } from './word-to-phrase-translations.resolver';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';

import { PhraseToPhraseTranslationResolver } from './phrase-to-phrase-translations.resolver';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [
    WordToWordTranslationResolver,
    WordToWordTranslationsService,
    WordToPhraseTranslationResolver,
    WordToPhraseTranslationsService,
    PhraseToPhraseTranslationResolver,
    PhraseToPhraseTranslationsService,
  ],
  exports: [
    WordToWordTranslationsService,
    WordToPhraseTranslationsService,
    PhraseToPhraseTranslationsService,
  ],
})
export class TranslationsModule {}
