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
import { OzoneApportionedEmissionsFacilityAggregationDTO } from '../../dto/ozone-apportioned-emissions-facility-aggregation.dto';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneApportionedEmissionsNationalAggregationDTO } from './../../dto/ozone-apportioned-emissions-national-aggregation.dto';
import { OzoneApportionedEmissionsStateAggregationDTO } from './../../dto/ozone-apportioned-emissions-state-aggregation.dto';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

@Injectable()
export class OzoneApportionedEmissionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager:EntityManager) => {
      let entities: OzoneUnitDataView[];

      try {
        const ozoneUnitDataRepository = new OzoneUnitDataRepository(replicaManager);
        entities = await ozoneUnitDataRepository.getEmissions(
          req,
          fieldMappings.emissions.ozone.data.aggregation.unit,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.ozone.data.aggregation.unit),
      );
      req.res.setHeader(
        excludableColumnHeader,
        JSON.stringify(fieldMappings.emissions.ozone.excludableColumns),
      );

      return entities;
    });
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsFacilityAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager:EntityManager) => {
      let query;

      try {
        const ozoneUnitDataRepository = new OzoneUnitDataRepository(replicaManager);
        query = await ozoneUnitDataRepository.getEmissionsFacilityAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.ozone.data.aggregation.facility),
      );

      return query.map(item => {
        return plainToClass(
          OzoneApportionedEmissionsFacilityAggregationDTO,
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
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsStateAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager:EntityManager) => {
      let query;

      try {
        const ozoneUnitDataRepository = new OzoneUnitDataRepository(replicaManager);
        query = await ozoneUnitDataRepository.getEmissionsStateAggregation(req, params);
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.ozone.data.aggregation.state),
      );

      return query.map(item => {
        return plainToClass(OzoneApportionedEmissionsStateAggregationDTO, item, {
          enableImplicitConversion: true,
        });
      });
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsNationalAggregationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager:EntityManager) => {
      let query;

      try {
        const ozoneUnitDataRepository = new OzoneUnitDataRepository(replicaManager);
        query = await ozoneUnitDataRepository.getEmissionsNationalAggregation(
          req,
          params,
        );
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.ozone.data.aggregation.national),
      );

      return query.map(item => {
        return plainToClass(
          OzoneApportionedEmissionsNationalAggregationDTO,
          item,
          {
            enableImplicitConversion: true,
          },
        );
      });
    });
  }
}
