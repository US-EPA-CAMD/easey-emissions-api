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
import { ExcludeApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { StreamService } from '@us-epa-camd/easey-common/stream';

import {
  fieldMappings,
  fieldMappingHeader,
  excludableColumnHeader,
} from '../../constants/field-mappings';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsDTO } from '../../dto/monthly-apportioned-emissions.dto';
import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
  StreamMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';
import { ReadStream } from 'fs';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../dto/monthly-apportioned-emissions-facility-aggregation.dto';

@Injectable()
export class MonthlyApportionedEmissionsService {
  constructor(
    @InjectRepository(MonthUnitDataRepository)
    private readonly repository: MonthUnitDataRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamService,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let entities: MonthUnitDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
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
  }

  async streamEmissions(
    req: Request,
    params: StreamMonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const query = this.repository.getStreamQuery(params);
    let stream: ReadStream = await this.streamService.getStream(query);

    req.on('close', () => {
      stream.emit('end');
    });

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.unit),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(MonthlyApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const fieldMappingsList = params.exclude
        ? fieldMappings.emissions.monthly.data.aggregation.unit.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.emissions.monthly.data.aggregation.unit;
      const toCSV = new PlainToCSV(fieldMappingsList);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="monthly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="monthly-emissions-${uuid()}.json"`,
    });
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthlyApportionedEmissionsFacilityAggregationDTO[]> {
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
      JSON.stringify(fieldMappings.emissions.monthly.data.aggregation.facility),
    );

    return query.map(item => {
      const dto = plainToClass(
        MonthlyApportionedEmissionsFacilityAggregationDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      return dto;
    });
  }

  async streamEmissionsFacilityAggregation(
    req: Request,
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    try {
      const query = this.repository.getFacilityStreamQuery(params);
      const stream: ReadStream = await this.streamService.getStream(query);

      req.on('close', () => {
        stream.emit('end');
      });

      req.res.setHeader(
        fieldMappingHeader,
        JSON.stringify(
          fieldMappings.emissions.monthly.data.aggregation.facility,
        ),
      );

      const toDto = new Transform({
        objectMode: true,
        transform(data, _enc, callback) {
          const dto = plainToClass(
            MonthlyApportionedEmissionsFacilityAggregationDTO,
            data,
            {
              enableImplicitConversion: true,
            },
          );
          callback(null, dto);
        },
      });

      if (req.headers.accept === 'text/csv') {
        const toCSV = new PlainToCSV(
          fieldMappings.emissions.monthly.data.aggregation.facility,
        );
        return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-facility-aggregation-${uuid()}.csv"`,
        });
      }

      const objToString = new PlainToJSON();
      return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
        type: req.headers.accept,
        disposition: `attachment; filename="monthly-emissions-facility-aggregation-${uuid()}.json"`,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
