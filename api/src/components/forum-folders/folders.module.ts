import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { ForumFolderResolver } from './folders.resolver';
import { ForumFoldersService } from './folders.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [ForumFoldersService, ForumFolderResolver],
  exports: [ForumFoldersService],
})
export class ForumFoldersModule {}
