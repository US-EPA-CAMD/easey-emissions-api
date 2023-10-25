import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from './../../dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from './../../dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from './../../dto/quarterly-apportioned-emissions-national-aggregation.dto';
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

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(QuarterUnitDataRepository)
    private readonly repository: QuarterUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let entities: QuarterUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.quarterly.data.aggregation.unit,
        params,
      );
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.quarterly.data.aggregation.unit),
    );
    req.res.setHeader(
      excludableColumnHeader,
      JSON.stringify(fieldMappings.emissions.quarterly.excludableColumns),
    );

    return entities;
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterlyApportionedEmissionsFacilityAggregationDTO[]> {
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
      JSON.stringify(
        fieldMappings.emissions.quarterly.data.aggregation.facility,
      ),
    );

    return query.map(item => {
      return plainToClass(
        QuarterlyApportionedEmissionsFacilityAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
    });
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterlyApportionedEmissionsStateAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsStateAggregation(req, params);
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.quarterly.data.aggregation.state),
    );

    return query.map(item => {
      return plainToClass(
        QuarterlyApportionedEmissionsStateAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
    });
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterlyApportionedEmissionsNationalAggregationDTO[]> {
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
      JSON.stringify(
        fieldMappings.emissions.quarterly.data.aggregation.national,
      ),
    );

    return query.map(item => {
      return plainToClass(
        QuarterlyApportionedEmissionsNationalAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
    });
  }
}
