import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { EmailResponseResolver } from './email-response.resolver'
import { SnsController } from './sns_notifications.controller'

@Module({
  imports: [CoreModule],
  providers: [SnsController, EmailResponseResolver],
  controllers: [SnsController],
  exports: [SnsController, EmailResponseResolver],
})
export class EmailModule {}
