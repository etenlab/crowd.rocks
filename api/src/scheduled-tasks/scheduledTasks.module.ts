import { Module } from '@nestjs/common';
import { MapsModule } from '../components/maps/maps.module';
import { MapReTranslationSchedule } from './mapRetranslation.schedule';

@Module({
  providers: [MapReTranslationSchedule],
  imports: [MapsModule],
})
export class ScheduledTasksModule {}
