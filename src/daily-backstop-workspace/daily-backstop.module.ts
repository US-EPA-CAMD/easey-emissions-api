import { Module } from '@nestjs/common';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopWorkspaceService } from './daily-backstop.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DailyBackstopWorkspaceRepository} from "./daily-backstop.repository";

@Module({
  imports: [
    BulkLoadModule,
    TypeOrmModule.forFeature([DailyBackstopWorkspaceRepository]),
  ],
  controllers: [],
  providers: [DailyBackstopWorkspaceService, DailyBackstopMap],
  exports: [TypeOrmModule, DailyBackstopWorkspaceService, DailyBackstopMap],
})
export class DailyBackstopWorkspaceModule {}
