import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';

import { MapsResolver } from './maps.resolver';
import { MapsService } from './maps.service';
import { WordsModule } from '../words/words.module';
import { MapsRepository } from './maps.repository';
import { DefinitionsModule } from '../definitions/definitions.module';
import { TranslationsModule } from '../translations/translations.module';
import { PhraseModule } from '../phrases/phrases.module';
import { FileModule } from '../file/file.module';
@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => WordsModule),
    forwardRef(() => PhraseModule),
    forwardRef(() => DefinitionsModule),
    forwardRef(() => TranslationsModule),
    FileModule,
  ],
  providers: [MapsService, MapsResolver, MapsRepository],
  exports: [MapsService],
})
export class MapsModule {}
