import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { ResponseHeaders } from '../utils/response.headers';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private repository: HourUnitDataRepository,
    private map: HourlyApportionedEmissionsMap,
  ) {}

  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<HourlyApportionedEmissionsDTO[]> {
    const { page, perPage } = hourlyApportionedEmissionsParamsDTO;

    let results = await this.repository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
    );

    if (page && perPage) {
      const pageNum: number = +page;
      const perPageNum: number = +perPage;

      const begin: number = (pageNum - 1) * perPageNum;
      const end: number = begin + perPageNum;

      const paginatedResults = results.slice(begin, end);
      const totalCount = results.length;

      ResponseHeaders.setPagination(req, totalCount);
      return this.map.many(paginatedResults);
    }
    return this.map.many(results);
  }
}
