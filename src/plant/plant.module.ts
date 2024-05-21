import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlantService } from './plant.service';
import { PlantRepository } from './plant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlantRepository])],
  providers: [PlantRepository, PlantService],
  exports: [TypeOrmModule, PlantRepository, PlantService],
})
export class PlantModule {}
