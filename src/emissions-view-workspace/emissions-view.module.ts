import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmissionsViewWorkspaceController } from './emissions-view.controller';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceService } from './emissions-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsViewWorkspaceRepository]), HttpModule],
  controllers: [EmissionsViewWorkspaceController],
  providers: [EmissionsViewWorkspaceService],
})
export class EmissionsViewWorkspaceModule {}
