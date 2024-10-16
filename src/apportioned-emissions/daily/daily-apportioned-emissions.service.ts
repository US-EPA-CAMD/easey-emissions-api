import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import {
  excludableColumnHeader,
  fieldMappingHeader,
  fieldMappings,
} from '../../constants/field-mappings';
import { DailyApportionedEmissionsFacilityAggregationDTO } from '../../dto/daily-apportioned-emissions-facility-aggregation.dto';
import { DailyApportionedEmissionsNationalAggregationDTO } from '../../dto/daily-apportioned-emissions-national-aggregation.dto';
import { DailyApportionedEmissionsStateAggregationDTO } from '../../dto/daily-apportioned-emissions-state-aggregation.dto';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';

@Injectable()
export class DailyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: DayUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let entities: DayUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.daily.data.aggregation.unit,
        params,
      );
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.daily.data.aggregation.unit),
    );
    req.res.setHeader(
      excludableColumnHeader,
      JSON.stringify(fieldMappings.emissions.daily.excludableColumns),
    );

    return entities;
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DailyApportionedEmissionsFacilityAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsFacilityAggregation(
        req,
        params,
      );
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.daily.data.aggregation.facility),
    );

    return query.map(item => {
      const dto = plainToClass(
        DailyApportionedEmissionsFacilityAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      const date = new Date(dto.date);
      dto.date = date.toISOString().split('T')[0];
      return dto;
    });
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DailyApportionedEmissionsStateAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsStateAggregation(req, params);
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.daily.data.aggregation.state),
    );

    return query.map(item => {
      const dto = plainToClass(
        DailyApportionedEmissionsStateAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      const date = new Date(dto.date);
      dto.date = date.toISOString().split('T')[0];
      return dto;
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DailyApportionedEmissionsNationalAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsNationalAggregation(
        req,
        params,
      );
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily.data.aggregation.national),
    );

    return query.map(item => {
      const dto = plainToClass(
        DailyApportionedEmissionsNationalAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      const date = new Date(dto.date);
      dto.date = date.toISOString().split('T')[0];
      return dto;
    });
  }
}
