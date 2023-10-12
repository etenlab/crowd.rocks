import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { DefinitionsService } from '../definitions/definitions.service';
import { PhraseDefinitionVotesService } from '../definitions/phrase-definition-votes.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { WordDefinitionVotesService } from '../definitions/word-definition-votes.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { PhraseModule } from '../phrases/phrases.module';
import { PhraseToPhraseTranslationsService } from '../translations/phrase-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from '../translations/phrase-to-word-translations.service';
import { TranslationsModule } from '../translations/translations.module';
import { TranslationsService } from '../translations/translations.service';
import { WordToPhraseTranslationsService } from '../translations/word-to-phrase-translations.service';
import { WordToWordTranslationRepository } from '../translations/word-to-word-translation.repository';
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { WordsModule } from '../words/words.module';
import { AiTranslationsService } from './ai-translations.service';
import { BotsResolver } from './bots.resolver';
import { ChatGPTService } from './chatgpt.service';
import { GoogleTranslateService } from './google-translate.service';
import { LiltTranslateService } from './lilt-translate.service';
import { SmartcatTranslateService } from './sc-translate.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => TranslationsModule),
    forwardRef(() => WordsModule),
    forwardRef(() => PhraseModule),
  ],
  providers: [
    BotsResolver,
    GoogleTranslateService,
    LiltTranslateService,
    SmartcatTranslateService,
    TranslationsService,
    AiTranslationsService,
    BotsModule,
    TranslationsService,
    WordToWordTranslationsService,
    WordDefinitionsService,
    WordToPhraseTranslationsService,
    PhraseToWordTranslationsService,
    PhraseToPhraseTranslationsService,
    DefinitionsService,
    WordToWordTranslationRepository,
    WordDefinitionVotesService,
    PhraseDefinitionsService,
    PhraseDefinitionVotesService,
    ChatGPTService,
  ],
  exports: [
    GoogleTranslateService,
    LiltTranslateService,
    SmartcatTranslateService,
    TranslationsService,
    AiTranslationsService,
    BotsModule,
  ],
})
export class BotsModule {}