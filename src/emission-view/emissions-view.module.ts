import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionsViewController } from './emissions-view.controller';
import { EmissionsViewRepository } from './emissions-view.repository';
import { EmissionsViewService } from './emissions-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionsViewRepository])],
  controllers: [EmissionsViewController],
  providers: [TypeOrmModule, EmissionsViewRepository, EmissionsViewService],
})
export class EmissionsViewModule {}
