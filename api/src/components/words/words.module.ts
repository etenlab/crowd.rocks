import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';

import { WordsResolver } from './words.resolver';
import { WordsService } from './words.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [WordsService, WordsResolver],
  exports: [WordsService],
})
export class WordsModule {}
