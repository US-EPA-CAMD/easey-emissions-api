import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private readonly hourlyRepository: HourUnitDataRepository,
    @InjectRepository(DayUnitDataRepository)
    private readonly dailyRepository: DayUnitDataRepository,
    private readonly hourlyMap: HourlyApportionedEmissionsMap,
    private readonly dailyMap: DailyApportionedEmissionsMap,
  ) {}

  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    const query = await this.hourlyRepository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
      req,
    );

    return this.hourlyMap.many(query);
  }

  async getDailyEmissions(
    dailyApportionedEmissionsParamsDTO: DailyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<DailyApportionedEmissionsDTO[]> {
    const query = await this.dailyRepository.getDailyEmissions(
      dailyApportionedEmissionsParamsDTO,
      req,
    );

    return this.dailyMap.many(query);
  }

  getMonthlyEmissions(
    monthlyApportionedEmissionsParamsDTO: MonthlyApportionedEmissionsParamsDTO,
    req: Request,
  ): string {
    return 'Hello World!';
  }
}
