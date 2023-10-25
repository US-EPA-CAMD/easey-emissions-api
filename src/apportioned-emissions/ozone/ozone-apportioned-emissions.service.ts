import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  fieldMappings,
  fieldMappingHeader,
  excludableColumnHeader,
} from '../../constants/field-mappings';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { OzoneApportionedEmissionsFacilityAggregationDTO } from '../../dto/ozone-apportioned-emissions-facility-aggregation.dto';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { OzoneApportionedEmissionsStateAggregationDTO } from './../../dto/ozone-apportioned-emissions-state-aggregation.dto';
import { OzoneApportionedEmissionsNationalAggregationDTO } from './../../dto/ozone-apportioned-emissions-national-aggregation.dto';

@Injectable()
export class OzoneApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(OzoneUnitDataRepository)
    private readonly repository: OzoneUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let entities: OzoneUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.ozone.data.aggregation.unit,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsFacilityAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsFacilityAggregation(
        req,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsStateAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsStateAggregation(
        req,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.ozone.data.aggregation.state),
    );

    return query.map(item => {
      return plainToClass(
        OzoneApportionedEmissionsStateAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneApportionedEmissionsNationalAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsNationalAggregation(
        req,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  }
}
