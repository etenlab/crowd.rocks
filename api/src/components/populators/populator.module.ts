import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FileModule } from '../file/file.module';
import { MapsModule } from '../maps/maps.module';
import { BotsModule } from '../translator-bots/bots.module';
import { PopulatorResolver } from './populator.resolver';
import { PopulatorService } from './populator.service';

@Module({
  imports: [
    MapsModule,
    FileModule,
    AuthorizationModule,
    HttpModule,
    BotsModule,
    CoreModule,
  ],
  providers: [PopulatorResolver, PopulatorService],
})
export class PopulatorModule {}
