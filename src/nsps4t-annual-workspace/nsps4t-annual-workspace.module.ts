import { Module } from '@nestjs/common';
import { Nsps4tAnnualWorkspaceService } from './nsps4t-annual-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tAnnualWorkspaceRepository])],
  providers: [Nsps4tAnnualWorkspaceService],
})
export class Nsps4tAnnualWorkspaceModule {}
