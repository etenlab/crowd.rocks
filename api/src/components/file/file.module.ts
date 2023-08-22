import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../model/entities';
@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileResolver, FileService],
})
export class FileModule {}
