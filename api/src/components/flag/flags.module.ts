import { Module } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';

import { FlagsResolver } from './flags.resolver';
import { FlagsService } from './flags.service';

@Module({
  imports: [CoreModule],
  providers: [FlagsResolver, FlagsService],
  exports: [FlagsResolver, FlagsService],
})
export class FlagsModule {}
