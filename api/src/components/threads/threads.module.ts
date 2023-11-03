import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { PostModule } from 'src/components/post/post.module';

import { ThreadResolver } from './thread.resolver';
import { ThreadsService } from './threads.service';

@Module({
  imports: [forwardRef(() => CoreModule), forwardRef(() => PostModule)],
  providers: [ThreadsService, ThreadResolver],
  exports: [ThreadsService],
})
export class ThreadModule {}
