import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../constants/field-mappings';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsDTO } from '../dto/ozone-apportioned-emissions.dto';
import { OzoneApportionedEmissionsMap } from '../maps/ozone-apportioned-emissions.map';
import { OzoneApportionedEmissionsParamsDTO } from '../dto/ozone-apportioned-emissions.params.dto';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    @InjectRepository(DayUnitDataRepository)
    private readonly dailyRepository: DayUnitDataRepository,
    @InjectRepository(MonthUnitDataRepository)
    private readonly monthlyRepository: MonthUnitDataRepository,
    @InjectRepository(QuarterUnitDataRepository)
    private readonly quarterlyRepository: QuarterUnitDataRepository,
    @InjectRepository(AnnualUnitDataRepository)
    private readonly annualRepository: AnnualUnitDataRepository,
    @InjectRepository(OzoneUnitDataRepository)
    private readonly ozoneRepository: OzoneUnitDataRepository,
    private readonly dailyMap: DailyApportionedEmissionsMap,
    private readonly monthlyMap: MonthlyApportionedEmissionsMap,
    private readonly quarterlyMap: QuarterlyApportionedEmissionsMap,
    private readonly annualMap: AnnualApportionedEmissionsMap,
    private readonly ozoneMap: OzoneApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getDailyEmissions(
    dailyApportionedEmissionsParamsDTO: DailyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<DailyApportionedEmissionsDTO[]> {
    let query;
    try {
      query = await this.dailyRepository.getDailyEmissions(
        dailyApportionedEmissionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

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
    let query;
    try {
      query = await this.monthlyRepository.getMonthlyEmissions(
        monthlyApportionedEmissionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

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
    let query;
    try {
      query = await this.quarterlyRepository.getQuarterlyEmissions(
        quarterlyApportionedEmissionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

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
    let query;
    try {
      query = await this.annualRepository.getAnnualEmissions(
        annualApportionedEmissionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    return this.annualMap.many(query);
  }

  async getOzoneEmissions(
    ozoneApportionedEmissionsParamsDTO: OzoneApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<OzoneApportionedEmissionsDTO[]> {
    let query;
    try {
      query = await this.ozoneRepository.getOzoneEmissions(
        ozoneApportionedEmissionsParamsDTO,
        req,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.ozone),
    );

    return this.ozoneMap.many(query);
  }
}
