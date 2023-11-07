import { Logger } from '@nestjs/common';
import { tag2langInfo } from '../../../../utils/dist';
import { LanguageInput } from '../common/types';
import { MapsRepository } from './maps.repository';
import { MapsService } from './maps.service';

export class ReTranslationService {
  constructor(
    private mapsRepository: MapsRepository,
    private mapsService: MapsService,
  ) {}

  async mapReTranslate(
    token: string,
    forLangTag?: string | null,
  ): Promise<void> {
    try {
      const originalMaps = await this.mapsRepository.getOrigMaps();
      if (!(originalMaps.mapList?.length > 0)) return;
      const origMapIds = originalMaps.mapList.map(
        (m) => m.mapDetails!.original_map_id,
      );
      for (const origMapId of origMapIds) {
        const { str: origMapString, details: origMapDetails } =
          await this.mapsService.getMapAsStringById(origMapId);
        if (forLangTag) {
          const langInfo = tag2langInfo(forLangTag);
          const toLang: LanguageInput = {
            language_code: langInfo.lang.tag,
            dialect_code: langInfo.dialect?.tag || null,
            geo_code: langInfo.region?.tag || null,
          };
          await this.mapsService.translateMapStringToLangAndSaveTranslated({
            origMapDetails,
            origMapString,
            token,
            toLang,
          });
        } else {
          await this.mapsService.translateMapStringToAllLangsAndSaveTranslated({
            origMapDetails,
            origMapString,
            token,
          });
        }
      }
    } catch (error) {
      Logger.error(`mapsService#reTranslate error: `, error);
    }
  }
}
