import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { FileRepository } from './file.repository';
@Module({
  providers: [FileResolver, FileService, FileRepository],
  imports: [forwardRef(() => CoreModule)],
  exports: [FileService, FileResolver],
})
export class FileModule {}
