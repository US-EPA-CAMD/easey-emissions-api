import { Module } from '@nestjs/common';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopService } from './daily-backstop.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DailyBackstopRepository} from "./daily-backstop.repository";

@Module({
  imports: [TypeOrmModule.forFeature([DailyBackstopRepository])],
  controllers: [],
  providers: [DailyBackstopService, DailyBackstopMap],
  exports: [TypeOrmModule, DailyBackstopService, DailyBackstopMap],
})
export class DailyBackstopModule {}
