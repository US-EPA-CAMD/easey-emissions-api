import { Module } from '@nestjs/common';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';

@Module({
  providers: [DailyFuelWorkspaceService]
})
export class DailyFuelWorkspaceModule {}
