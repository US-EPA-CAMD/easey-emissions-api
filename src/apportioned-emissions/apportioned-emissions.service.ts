import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { fieldMappings } from '../constants/field-mappings';
import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private readonly hourlyRepository: HourUnitDataRepository,
    @InjectRepository(DayUnitDataRepository)
    private readonly dailyRepository: DayUnitDataRepository,
    @InjectRepository(MonthUnitDataRepository)
    private readonly monthlyRepository: MonthUnitDataRepository,
    @InjectRepository(QuarterUnitDataRepository)
    private readonly quarterlyRepository: QuarterUnitDataRepository,
    @InjectRepository(AnnualUnitDataRepository)
    private readonly annualRepository: AnnualUnitDataRepository,
    private readonly hourlyMap: HourlyApportionedEmissionsMap,
    private readonly dailyMap: DailyApportionedEmissionsMap,
    private readonly monthlyMap: MonthlyApportionedEmissionsMap,
    private readonly quarterlyMap: QuarterlyApportionedEmissionsMap,
    private readonly annualMap: AnnualApportionedEmissionsMap,
  ) {}

  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    const query = await this.hourlyRepository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
      req,
    );

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly),
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

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily),
    );

    return this.dailyMap.many(query);
  }

  async getMonthlyEmissions(
    monthlyApportionedEmissionsParamsDTO: MonthlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<MonthlyApportionedEmissionsDTO[]> {
    const query = await this.monthlyRepository.getMonthlyEmissions(
      monthlyApportionedEmissionsParamsDTO,
      req,
    );

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.monthly),
    );

    return this.monthlyMap.many(query);
  }

  async getQuarterlyEmissions(
    quarterlyApportionedEmissionsParamsDTO: QuarterlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<QuarterlyApportionedEmissionsDTO[]> {
    const query = await this.quarterlyRepository.getQuarterlyEmissions(
      quarterlyApportionedEmissionsParamsDTO,
      req,
    );

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.quarterly),
    );

    return this.quarterlyMap.many(query);
  }

  async getAnnualEmissions(
    annualApportionedEmissionsParamsDTO: AnnualApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<AnnualApportionedEmissionsDTO[]> {
    const query = await this.annualRepository.getAnnualEmissions(
      annualApportionedEmissionsParamsDTO,
      req,
    );

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    return this.annualMap.many(query);
  }
}
