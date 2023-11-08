import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [forwardRef(() => AuthenticationModule)],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
