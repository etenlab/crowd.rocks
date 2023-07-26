import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';

import { MapsResolver } from './maps.resolver';
import { MapsService } from './maps.service';
import { WordsModule } from '../words/words.module';
import { MapsRepository } from './maps.repository';
import { DefinitionsModule } from '../definitions/definitions.module';
@Module({
  imports: [
    forwardRef(() => CoreModule),
    AuthenticationModule,
    WordsModule,
    DefinitionsModule,
  ],
  providers: [MapsService, MapsResolver, MapsRepository],
  exports: [MapsService],
})
export class MapModule {}
