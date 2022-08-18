import { Module } from '@nestjs/common';
import { PlantService } from './plant.service';

@Module({
  providers: [PlantService],
})
export class PlantModule {}
