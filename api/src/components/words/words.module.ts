import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { WordReadResolver } from './word-read.resolver';
import { WordUpsertResolver } from './word-upsert.resolver';

@Module({
  imports: [CoreModule],
  providers: [WordReadResolver, WordUpsertResolver],
  exports: [WordReadResolver, WordUpsertResolver],
})
export class WordModule {}
