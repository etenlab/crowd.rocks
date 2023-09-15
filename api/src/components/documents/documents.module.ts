import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { FileModule } from '../file/file.module';
import { DocumentsResolver } from './documents.resolver';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';
@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthenticationModule),
    FileModule,
  ],
  providers: [DocumentsResolver, DocumentsService, DocumentsRepository],
  exports: [DocumentsService],
})
export class DocumentsModule {}
