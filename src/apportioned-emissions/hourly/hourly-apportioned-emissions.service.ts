import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import {
  excludableColumnHeader,
  fieldMappingHeader,
  fieldMappings,
} from '../../constants/field-mappings';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../dto/hourly-apportioned-emissions-national-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../dto/hourly-apportioned-emissions-state-aggregation.dto';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let entities: HourUnitDataView[];

      try {
        const hourUnitDataRepository = new HourUnitDataRepository(replicaManager);
        entities = await hourUnitDataRepository.getEmissions(
          req,
          fieldMappings.emissions.hourly.data.aggregation.unit,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.data.aggregation.unit),
      );
      req.res.setHeader(
        excludableColumnHeader,
        JSON.stringify(fieldMappings.emissions.hourly.excludableColumns),
      );

      return entities;
    });
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsFacilityAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const hourUnitDataRepository = new HourUnitDataRepository(replicaManager);
        query = await hourUnitDataRepository.getEmissionsFacilityAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.data.aggregation.facility),
      );

      return query.map(item => {
        const dto = plainToClass(
          HourlyApportionedEmissionsFacilityAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        return dto;
      });
    });
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsStateAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const hourUnitDataRepository = new HourUnitDataRepository(replicaManager);
        query = await hourUnitDataRepository.getEmissionsStateAggregation(req, params);
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.data.aggregation.state),
      );

      return query.map(item => {
        const dto = plainToClass(
          HourlyApportionedEmissionsStateAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        return dto;
      });
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsNationalAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const hourUnitDataRepository = new HourUnitDataRepository(replicaManager);
        query = await hourUnitDataRepository.getEmissionsNationalAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.data.aggregation.national),
      );

      return query.map(item => {
        const dto = plainToClass(
          HourlyApportionedEmissionsNationalAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        return dto;
      });
    });
  }
}
