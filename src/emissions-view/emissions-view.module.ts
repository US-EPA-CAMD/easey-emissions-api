import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmissionsViewController } from './emissions-view.controller';
import { EmissionsViewRepository } from './emissions-view.repository';
import { EmissionsViewService } from './emissions-view.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmissionsViewRepository]),
  ],
  controllers: [EmissionsViewController],
  providers: [EmissionsViewService],
})
export class EmissionsViewModule {}
