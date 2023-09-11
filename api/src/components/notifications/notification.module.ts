import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    forwardRef(() => CoreModule),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [NotificationService, NotificationResolver, NotificationModule],
  exports: [NotificationService, NotificationResolver],
})
export class NotificationModule {}
