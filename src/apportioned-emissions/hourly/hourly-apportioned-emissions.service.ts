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

import { fieldMappings, fieldMappingHeader } from '../../constants/field-mappings';
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
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../dto/hourly-apportioned-emissions-national-aggregation.dto';

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
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.hourly.aggregation.unit),
    );

    return entities;
  }

  async streamEmissions(
    req: Request,
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const query = this.repository.getStreamQuery(params);
    let stream: ReadStream = await this.streamService.getStream(query);

    req.on('close', () => {
      stream.emit('end');
    });

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.hourly.aggregation.unit),
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
        ? fieldMappings.emissions.hourly.aggregation.unit.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.emissions.hourly.aggregation.unit;

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
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.hourly.aggregation.facility),
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
      const query = this.repository.getFacilityStreamQuery(params);
      let stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.aggregation.facility),
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
        const toCSV = new PlainToCSV(
          fieldMappings.emissions.hourly.aggregation.facility,
        );
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
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.hourly.aggregation.state),
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
      const query = this.repository.getStateStreamQuery(params);
      let stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.aggregation.state),
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
        const toCSV = new PlainToCSV(
          fieldMappings.emissions.hourly.aggregation.state,
        );
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

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourlyApportionedEmissionsNationalAggregationDTO[]> {
    let query;

    try {
      query = await this.repository.getEmissionsNationalAggregation(
        req,
        params,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.hourly.aggregation.national),
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
  }

  async streamEmissionsNationalAggregation(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    try {
      const query = this.repository.getNationalStreamQuery(params);
      let stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(fieldMappings.emissions.hourly.aggregation.national),
      );

      const toDto = new Transform({
        objectMode: true,
        transform(data, _enc, callback) {
          const dto = plainToClass(
            HourlyApportionedEmissionsNationalAggregationDTO,
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
        const toCSV = new PlainToCSV(
          fieldMappings.emissions.hourly.aggregation.national,
        );
        return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
          type: req.headers.accept,
          disposition: `attachment; filename="hourly-emissions-national-aggregation${uuid()}.csv"`,
        });
      }

      const objToString = new PlainToJSON();
      return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
        type: req.headers.accept,
        disposition: `attachment; filename="hourly-emissions-national-aggregation${uuid()}.json"`,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
