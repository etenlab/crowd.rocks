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
import { MapVotesService } from './map-votes.service';
import { UserModule } from '../user/user.module';
import { MapsTranslationService } from './maps-translation.service';
import { AuthorizationModule } from '../authorization/authorization.module';
@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => FileModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => AuthorizationModule),
    forwardRef(() => WordsModule),
    forwardRef(() => PhraseModule),
    forwardRef(() => DefinitionsModule),
    forwardRef(() => TranslationsModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    MapsService,
    MapsTranslationService,
    MapVotesService,
    MapsResolver,
    MapsRepository,
  ],
  exports: [MapsService, MapsResolver, MapsTranslationService, MapVotesService],
})
export class MapsModule {}
