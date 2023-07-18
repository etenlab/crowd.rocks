import { Injectable } from '@nestjs/common';
import { Config } from 'apollo-server-core';
import { readFileSync } from 'fs';
import { justBearerHeader } from 'src/common/utility';
import { RegisterResolver } from 'src/components/authentication/register.resolver';
import { ConfigService } from './config.service';
import { PostgresService } from './postgres.service';
import { SesService } from './ses.service';
import { siteText } from './data/lang'

@Injectable()
export class DataLoadService {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
  ) {
    this.loadSiteTextData()
  }

    async loadSiteTextData(){
      console.log('loading site text data')
      
      console.log(siteText.Menu)
      
      
    }
}
 