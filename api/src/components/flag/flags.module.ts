import { Module } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DefinitionsModule } from '../definitions/definitions.module';

import { FlagsResolver } from './flags.resolver';
import { FlagsService } from './flags.service';

@Module({
  imports: [CoreModule, DefinitionsModule],
  providers: [FlagsResolver, FlagsService],
  exports: [FlagsResolver, FlagsService],
})
export class FlagsModule {}
