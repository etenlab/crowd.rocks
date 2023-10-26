import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AvatarUpdateResolver } from './avatar-update.resolver';
import { PasswordResetResolver } from '../authentication/password-reset.resolver';
import { UserReadResolver } from './user-read.resolver';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => CoreModule)],
  providers: [
    UserReadResolver,
    AvatarUpdateResolver,
    PasswordResetResolver,
    UserService,
  ],
  exports: [
    UserReadResolver,
    AvatarUpdateResolver,
    PasswordResetResolver,
    UserService,
  ],
})
export class UserModule {}
