import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { ResponseHeaders } from '../utils/response.headers';
import { HourUnitData } from '../entities/hour-unit-data.entity';

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
    const {
      page,
      perPage,
      unitFuelType,
      controlTechnologies,
    } = hourlyApportionedEmissionsParamsDTO;

    let results = await this.repository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
    );

    let filteredResults: Array<HourUnitData> = [];

    if (unitFuelType && !controlTechnologies) {
      results.forEach(e => {
        if (
          (e.unitFact.primaryFuelInfo &&
            e.unitFact.primaryFuelInfo === unitFuelType) ||
          (e.unitFact.secondaryFuelInfo &&
            e.unitFact.secondaryFuelInfo.split('<br>').includes(unitFuelType))
        ) {
          filteredResults.push(e);
        }
      });
      results = filteredResults;
    }

    if (!unitFuelType && controlTechnologies) {
      results.forEach(e => {
        if (
          (e.unitFact.noxControlInfo &&
            e.unitFact.noxControlInfo
              .split('<br>')
              .includes(controlTechnologies)) ||
          (e.unitFact.so2ControlInfo &&
            e.unitFact.so2ControlInfo
              .split('<br>')
              .includes(controlTechnologies)) ||
          (e.unitFact.partControlInfo &&
            e.unitFact.partControlInfo
              .split('<br>')
              .includes(controlTechnologies)) ||
          (e.unitFact.hgControlInfo &&
            e.unitFact.hgControlInfo
              .split('<br>')
              .includes(controlTechnologies))
        ) {
          filteredResults.push(e);
        }
      });
      results = filteredResults;
    }

    if (unitFuelType && controlTechnologies) {
      results.forEach(e => {
        let hasFuel = false;

        if (
          (e.unitFact.primaryFuelInfo &&
            e.unitFact.primaryFuelInfo === unitFuelType) ||
          (e.unitFact.secondaryFuelInfo &&
            e.unitFact.secondaryFuelInfo.split('<br>').includes(unitFuelType))
        ) {
          hasFuel = true;
        }

        if (
          hasFuel &&
          ((e.unitFact.noxControlInfo &&
            e.unitFact.noxControlInfo
              .split('<br>')
              .includes(controlTechnologies)) ||
            (e.unitFact.so2ControlInfo &&
              e.unitFact.so2ControlInfo
                .split('<br>')
                .includes(controlTechnologies)) ||
            (e.unitFact.partControlInfo &&
              e.unitFact.partControlInfo
                .split('<br>')
                .includes(controlTechnologies)) ||
            (e.unitFact.hgControlInfo &&
              e.unitFact.hgControlInfo
                .split('<br>')
                .includes(controlTechnologies)))
        ) {
          filteredResults.push(e);
        }
      });
      results = filteredResults;
    }

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
