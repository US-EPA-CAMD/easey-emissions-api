import { Module } from '@nestjs/common';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';

@Module({
  controllers: [EmissionsController],
  providers: [EmissionsService],
})
export class EmissionsModule {}
