import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { MapsResolver } from './maps.resolver';
import { MapsService } from './maps.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [MapsService, MapsResolver],
  exports: [MapsService],
})
export class MapModule {}
