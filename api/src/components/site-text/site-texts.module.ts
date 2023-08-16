import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { WordsModule } from '../words/words.module';
import { PhraseModule } from '../phrases/phrases.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';
import { TranslationsModule } from 'src/components/translations/translations.module';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationsService } from './site-text-translations.service';
import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';
import { SiteTextTranslationVotesService } from './site-text-translation-votes.service';

import { SiteTextsResolver } from './site-texts.resolver';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => TranslationsModule),
    forwardRef(() => WordsModule),
    forwardRef(() => PhraseModule),
    forwardRef(() => DefinitionsModule),
  ],
  providers: [
    SiteTextsService,
    SiteTextTranslationsService,
    SiteTextWordDefinitionsService,
    SiteTextPhraseDefinitionsService,
    SiteTextTranslationVotesService,
    SiteTextsResolver,
  ],
  exports: [
    SiteTextsService,
    SiteTextTranslationsService,
    SiteTextWordDefinitionsService,
    SiteTextPhraseDefinitionsService,
    SiteTextTranslationVotesService,
  ],
})
export class SiteTextsModule {}
