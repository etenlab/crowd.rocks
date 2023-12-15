import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthenticationService } from '../components/authentication/authentication.service';
import { MapsTranslationService } from '../components/maps/maps-translation.service';

@Injectable()
export class MapReTranslationSchedule {
  constructor(
    private readonly mapsTranslationService: MapsTranslationService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'retranslation' })
  async handleCron() {
    Logger.log(`MapReTranslationSchedule: checking maps for retranslation.`);
    const token = await this.authenticationService.getAdminToken();
    const retranslated =
      await this.mapsTranslationService.retranslateMarkedMaps(token);
    const newlyTranslated =
      await this.mapsTranslationService.checkAndCreateNewlyTranslatedMaps(
        token,
      );
    if (retranslated.length > 0 || newlyTranslated.length > 0) {
      Logger.log(
        `MapReTranslationSchedule: retranslated maps ${JSON.stringify(
          retranslated,
        )}`,
      );
      Logger.log(
        `MapReTranslationSchedule: NewlyTranslated maps ${JSON.stringify(
          newlyTranslated,
        )}`,
      );
    }
  }
}
