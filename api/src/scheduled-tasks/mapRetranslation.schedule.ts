import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MapsTranslationService } from '../components/maps/maps-translation.service';

@Injectable()
export class MapReTranslationSchedule {
  constructor(
    private readonly mapsTranslationService: MapsTranslationService,
  ) {}
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    Logger.log('MapReTranslationSchedule is called.');
    this.mapsTranslationService.retranslateMarkedMaps();
  }
}
