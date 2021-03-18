import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private hourlyRepository: HourUnitDataRepository,
    private hourlyMap: HourlyApportionedEmissionsMap,
  ) {}

  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {

    let query = await this.hourlyRepository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
      req,
    );

    return this.hourlyMap.many(query);
  }
}
