import { Module } from '@nestjs/common';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopWorkspaceService } from './daily-backstop.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    BulkLoadModule,
  ],
  controllers: [],
  providers: [DailyBackstopWorkspaceService, DailyBackstopMap],
  exports: [DailyBackstopWorkspaceService, DailyBackstopMap],
})
export class DailyBackstopWorkspaceModule {}
