import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PericopeTrResolver } from './pericope-tr.resolver';
import { PericopeTrService } from './pericope-tr.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthorizationModule),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [PericopeTrService, PericopeTrResolver],
  exports: [],
})
export class PericopeTrModule {}
