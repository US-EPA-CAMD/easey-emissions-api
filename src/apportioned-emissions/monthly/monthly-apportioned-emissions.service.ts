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
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from '../../dto/monthly-apportioned-emissions-national-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from '../../dto/monthly-apportioned-emissions-state-aggregation.dto';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';

@Injectable()
export class MonthlyApportionedEmissionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let entities: MonthUnitDataView[];

      try {
        const monthUnitDataRepository = new MonthUnitDataRepository(replicaManager);
        entities = await monthUnitDataRepository.getEmissions(
          req,
          fieldMappings.emissions.monthly.data.aggregation.unit,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.unit),
      );
      req.res.setHeader(
        excludableColumnHeader,
        JSON.stringify(fieldMappings.emissions.monthly.excludableColumns),
      );

      return entities;
    });
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsFacilityAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const monthUnitDataRepository = new MonthUnitDataRepository(replicaManager);
        query = await monthUnitDataRepository.getEmissionsFacilityAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.facility),
      );

      return query.map(item => {
        return plainToClass(
          MonthlyApportionedEmissionsFacilityAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
      });
    });
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsStateAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const monthUnitDataRepository = new MonthUnitDataRepository(replicaManager);
        query = await monthUnitDataRepository.getEmissionsStateAggregation(req, params);
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.state),
      );

      return query.map(item => {
        return plainToClass(
          MonthlyApportionedEmissionsStateAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
      });
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsNationalAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;

      try {
        const monthUnitDataRepository = new MonthUnitDataRepository(replicaManager);
        query = await monthUnitDataRepository.getEmissionsNationalAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.national),
      );

      return query.map(item => {
        return plainToClass(
          MonthlyApportionedEmissionsNationalAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
      });
    });
  }
}
