import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  StreamableFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { PlainToCSV, PlainToJSON } from '@us-epa-camd/easey-common/transforms';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeHourlyApportionedEmissions } from '@us-epa-camd/easey-common/enums';

import { fieldMappings } from '../../constants/field-mappings';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsDTO } from '../../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/hourly-apportioned-emissions-facility-aggregation.dto';
import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
  StreamHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private readonly repository: HourUnitDataRepository,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let entities: HourUnitDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly.unit),
    );

    return entities;
  }

  async streamEmissions(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly.unit),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeHourlyApportionedEmissions);
        const dto = plainToClass(HourlyApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const fieldMappingsList = params.exclude
        ? fieldMappings.emissions.hourly.unit.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.emissions.hourly.unit;

      const toCSV = new PlainToCSV(fieldMappingsList);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="hourly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="hourly-emissions-${uuid()}.json"`,
    });
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsFacilityAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsFacilityAggregation(
        req,
        params,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly.facility),
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
  }

  async streamEmissionsFacilityAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissionsFacilityAggregation(
      params,
    );

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly.facility),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          HourlyApportionedEmissionsFacilityAggregationDTO,
          data,
          {
            enableImplicitConversion: true,
          },
        );
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const toCSV = new PlainToCSV(fieldMappings.emissions.hourly.facility);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="hourly-emissions-facility-aggregation${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="hourly-emissions-facility-aggregation${uuid()}.json"`,
    });
  }
}
