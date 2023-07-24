import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';

import { MapsResolver } from './maps.resolver';
import { MapsService } from './maps.service';

@Module({
  imports: [forwardRef(() => CoreModule), AuthenticationModule],
  providers: [MapsService, MapsResolver],
  exports: [MapsService],
})
export class MapModule {}
