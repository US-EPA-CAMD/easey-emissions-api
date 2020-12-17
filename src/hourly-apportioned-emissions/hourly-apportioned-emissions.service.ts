import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { ResponseHeaders } from '../utils/response.headers';
import { UnitFuelType } from 'src/enums/unit-fuel-type.enum';
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
    let results = this.repository.getHourlyEmissions(
      hourlyApportionedEmissionsParamsDTO,
    );
    const {
      page,
      perPage,
      unitFuelType,
      controlTechnologies,
    } = hourlyApportionedEmissionsParamsDTO;
    let filteredResults: Array<HourUnitData> = [];

    if (unitFuelType && !controlTechnologies) {
      (await results).forEach(e => {
        let containsUnit = false;
        if (e.unitFact.primaryFuelInfo) {
          if (e.unitFact.primaryFuelInfo === unitFuelType) {
            containsUnit = true;
          }
        }
        if (e.unitFact.secondaryFuelInfo) {
          const unitFuelList = e.unitFact.secondaryFuelInfo.split('<br>');
          if (unitFuelList.includes(unitFuelType)) {
            containsUnit = true;
          }
        }
        if (containsUnit) {
          filteredResults.push(e);
        }
      });
    }

    if (!unitFuelType && controlTechnologies) {
      (await results).forEach(e => {
        let contains = false;
        if (e.unitFact.noxControlInfo) {
          const unitControlList = e.unitFact.noxControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            contains = true;
          }
        }
        if (e.unitFact.so2ControlInfo && !contains) {
          const unitControlList = e.unitFact.so2ControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            contains = true;
          }
        }
        if (e.unitFact.partControlInfo && !contains) {
          const unitControlList = e.unitFact.partControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            contains = true;
          }
        }
        if (e.unitFact.hgControlInfo && !contains) {
          const unitControlList = e.unitFact.hgControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            contains = true;
          }
        }
        if (contains) {
          filteredResults.push(e);
        }
      });
    }

    if (unitFuelType && controlTechnologies) {
      (await results).forEach(e => {
        let containsControls = false;
        let containsUnit = false;
        
        if (e.unitFact.primaryFuelInfo) {
          if (e.unitFact.primaryFuelInfo === unitFuelType) {
            containsUnit = true;
          }
        }
        if (e.unitFact.secondaryFuelInfo) {
          const unitFuelList = e.unitFact.secondaryFuelInfo.split('<br>');
          if (unitFuelList.includes(unitFuelType)) {
            containsUnit = true;
          }
        }
        if (e.unitFact.noxControlInfo && !containsControls) {
          const unitControlList = e.unitFact.noxControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            containsControls = true;
          }
        }
        if (e.unitFact.so2ControlInfo && !containsControls) {
          const unitControlList = e.unitFact.so2ControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            containsControls = true;
          }
        }
        if (e.unitFact.partControlInfo && !containsControls) {
          const unitControlList = e.unitFact.partControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            containsControls = true;
          }
        }
        if (e.unitFact.hgControlInfo && !containsControls) {
          const unitControlList = e.unitFact.hgControlInfo.split('<br>');
          if (unitControlList.includes(controlTechnologies)) {
            containsControls = true;
          }
        }
        if (containsUnit && containsControls) {
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
