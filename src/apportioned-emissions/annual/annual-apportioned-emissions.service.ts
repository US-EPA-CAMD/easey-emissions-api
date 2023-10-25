import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

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

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { AnnualApportionedEmissionsAggregationDTO } from '../../dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../dto/annual-apportioned-emissions-facility-aggregation.dto';
import { AnnualApportionedEmissionsStateAggregationDTO } from '../../dto/annual-apportioned-emissions-state-aggregation.dto';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AnnualApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AnnualUnitDataRepository)
    private readonly repository: AnnualUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let entities: AnnualUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.annual.data.aggregation.unit,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.annual.data.aggregation.unit),
    );
    req.res.setHeader(
      excludableColumnHeader,
      JSON.stringify(fieldMappings.emissions.annual.excludableColumns),
    );

    return entities;
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsFacilityAggregationDTO[]> {
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
      JSON.stringify(fieldMappings.emissions.annual.data.aggregation.facility),
    );

    return query.map(item => {
      return plainToClass(
        AnnualApportionedEmissionsFacilityAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
    });
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsStateAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsStateAggregation(req, params);
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.annual.data.aggregation.state),
    );

    return query.map(item => {
      return plainToClass(AnnualApportionedEmissionsStateAggregationDTO, item, {
        enableImplicitConversion: true,
      });
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsAggregationDTO[]> {
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
      JSON.stringify(fieldMappings.emissions.annual.data.aggregation.national),
    );

    return query.map(item => {
      return plainToClass(AnnualApportionedEmissionsAggregationDTO, item, {
        enableImplicitConversion: true,
      });
    });
  }
}
