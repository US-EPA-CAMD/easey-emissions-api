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
      beginDate,
      endDate,
      unitFuelType,
      controlTechnologies,
    } = hourlyApportionedEmissionsParamsDTO;

    if (beginDate && endDate && (endDate < beginDate)) {
      throw new BadRequestException('Please enter an end date that is equal to or greater than the begin date');
    }

    let results = this.repository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
    );
    
    let filteredResults: Array<HourUnitData> = [];

    if (unitFuelType && !controlTechnologies) {
      (await results).forEach(e => {
        if (
          (e.unitFact.primaryFuelInfo &&
            e.unitFact.primaryFuelInfo === unitFuelType) ||
          (e.unitFact.secondaryFuelInfo &&
            e.unitFact.secondaryFuelInfo.split('<br>').includes(unitFuelType))
        ) {
          filteredResults.push(e);
        }
      });
    }

    if (!unitFuelType && controlTechnologies) {
      (await results).forEach(e => {
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
    }

    if (unitFuelType && controlTechnologies) {
      (await results).forEach(e => {
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
    }

    const pageNum: number = +page;
    const perPageNum: number = +perPage;

    const begin: number = (pageNum - 1) * perPageNum;
    const end: number = begin + perPageNum;

    let paginatedResults;
    let totalCount;

    if (unitFuelType || controlTechnologies) {
      paginatedResults = filteredResults.slice(begin, end);
      totalCount = filteredResults.length;
    } else {
      paginatedResults = (await results).slice(begin, end);
      totalCount = (await results).length;
    }

    ResponseHeaders.setPagination(req, totalCount);
    return this.map.many(paginatedResults);
  }
}
