import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DefinitionsModule } from '../definitions/definitions.module';
import { FileModule } from '../file/file.module';
import { MapsModule } from '../maps/maps.module';
import { PhraseModule } from '../phrases/phrases.module';
import { BotsModule } from '../translator-bots/bots.module';
import { WordsModule } from '../words/words.module';
import { PopulatorResolver } from './populator.resolver';
import { PopulatorService } from './populator.service';

@Module({
  imports: [
    MapsModule,
    FileModule,
    AuthorizationModule,
    HttpModule,
    BotsModule,
    CoreModule,
    AuthenticationModule,
    DefinitionsModule,
    WordsModule,
    PhraseModule,
  ],
  providers: [PopulatorResolver, PopulatorService],
})
export class PopulatorModule {}
