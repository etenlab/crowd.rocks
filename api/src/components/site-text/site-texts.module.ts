import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DefinitionsModule } from 'src/components/definitions/definitions.module';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationsService } from './site-text-translations.service';
import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import { SiteTextsResolver } from './site-texts.resolver';

@Module({
  imports: [forwardRef(() => CoreModule), DefinitionsModule],
  providers: [
    SiteTextsService,
    SiteTextTranslationsService,
    SiteTextWordDefinitionsService,
    SiteTextPhraseDefinitionsService,
    SiteTextsResolver,
  ],
  exports: [
    SiteTextsService,
    SiteTextTranslationsService,
    SiteTextWordDefinitionsService,
    SiteTextPhraseDefinitionsService,
  ],
})
export class SiteTextsModule {}
