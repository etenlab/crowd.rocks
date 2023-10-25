import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { DocumentsModule } from 'src/components/documents/documents.module';

import { PericopiesResolver } from './pericopies.resolver';

import { PericopeVotesService } from './pericope-votes.service';
import { PericopiesService } from './pericopies.service';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => DocumentsModule),
    forwardRef(() => AuthorizationModule),
  ],
  providers: [PericopiesService, PericopeVotesService, PericopiesResolver],
  exports: [PericopiesService, PericopeVotesService],
})
export class PericopiesModule {}
