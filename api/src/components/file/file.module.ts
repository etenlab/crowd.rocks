import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
@Module({
  providers: [FileResolver, FileService],
})
export class FileModule {}
