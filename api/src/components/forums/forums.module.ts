import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { ForumsResolver } from './forums.resolver';
import { ForumsService } from './forums.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [ForumsService, ForumsResolver],
  exports: [ForumsService],
})
export class ForumsModule {}
