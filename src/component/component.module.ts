import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentRepository } from './component.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentRepository])],
  controllers: [],
  providers: [ComponentRepository],
  exports: [TypeOrmModule, ComponentRepository],
})
export class ComponentModule {}
