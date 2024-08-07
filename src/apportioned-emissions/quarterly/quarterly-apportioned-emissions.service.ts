import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import {
  excludableColumnHeader,
  fieldMappingHeader,
  fieldMappings,
} from '../../constants/field-mappings';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from './../../dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from './../../dto/quarterly-apportioned-emissions-national-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from './../../dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
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
      throw new EaseyException(
        new Error(e.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new EaseyException(
        new Error(e.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new EaseyException(
        new Error(e.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new EaseyException(
        new Error(e.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
