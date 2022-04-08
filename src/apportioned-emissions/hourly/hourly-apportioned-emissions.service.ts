import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import {
  Injectable,
  StreamableFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { PlainToJSON, PlainToCSV } from '@us-epa-camd/easey-common/transforms';
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
import { ReadStream } from 'fs';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../dto/hourly-apportioned-emissions-state-aggregation.dto';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitDataRepository)
    private readonly repository: HourUnitDataRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamService,
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
    try {
      const query = this.repository.getStreamQuery(params);
      let stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

      req.res.setHeader(
        'X-Field-Mappings',
        JSON.stringify(fieldMappings.emissions.hourly),
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
    } catch (e) {
      console.log(e);
      return null;
    }
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
    try {
      const query = this.repository.getStreamQuery(params);
      let stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

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
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsStateAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsStateAggregation(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly.state),
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
  }

  async streamEmissionsStateAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    try {
      const stream = await this.repository.streamEmissionsStateAggregation(
        params,
      );

      req.on('close', () => {
        if (!stream.destroyed) {
          stream.destroy();
          return null;
        }
      });

      req.res.setHeader(
        'X-Field-Mappings',
        JSON.stringify(fieldMappings.emissions.hourly.state),
      );

      const toDto = new Transform({
        objectMode: true,
        transform(data, _enc, callback) {
          const dto = plainToClass(
            HourlyApportionedEmissionsStateAggregationDTO,
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
        const toCSV = new PlainToCSV(fieldMappings.emissions.hourly.state);
        return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
          type: req.headers.accept,
          disposition: `attachment; filename="hourly-emissions-state-aggregation${uuid()}.csv"`,
        });
      }

      const objToString = new PlainToJSON();
      return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
        type: req.headers.accept,
        disposition: `attachment; filename="hourly-emissions-state-aggregation${uuid()}.json"`,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
