import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { AvatarUpdateResolver } from './avatar-update.resolver'
import { PasswordResetResolver } from '../authentication/password-reset.resolver'
import { UserReadResolver } from './user-read.resolver'

@Module({
  imports: [CoreModule],
  providers: [UserReadResolver, AvatarUpdateResolver, PasswordResetResolver],
  exports: [UserReadResolver, AvatarUpdateResolver, PasswordResetResolver],
})
export class UserModule {}
