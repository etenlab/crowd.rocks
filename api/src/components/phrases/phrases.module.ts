import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { PhraseReadResolver } from './phrase-read.resolver';
import { PhraseUpsertResolver } from './phrase-upsert.resolver';

@Module({
  imports: [CoreModule],
  providers: [PhraseReadResolver, PhraseUpsertResolver],
  exports: [PhraseReadResolver, PhraseUpsertResolver],
})
export class WordModule {}
