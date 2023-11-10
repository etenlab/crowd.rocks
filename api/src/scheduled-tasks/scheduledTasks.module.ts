import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../components/authentication/authentication.module';
import { MapsModule } from '../components/maps/maps.module';
import { MapReTranslationSchedule } from './mapRetranslation.schedule';

@Module({
  providers: [MapReTranslationSchedule],
  imports: [MapsModule, AuthenticationModule],
})
export class ScheduledTasksModule {}
