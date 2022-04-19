import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';
import { PlainToCSV, PlainToJSON } from '@us-epa-camd/easey-common/transforms';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeHourlyMatsApportionedEmissions } from '@us-epa-camd/easey-common/enums';
import { StreamService } from '@us-epa-camd/easey-common/stream';

import {
  fieldMappings,
  fieldMappingHeader,
  excludableColumnHeader,
} from '../../../constants/field-mappings';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import {
  PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  StreamHourlyMatsApportionedEmissionsParamsDTO,
} from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { HourlyMatsApportionedEmissionsDTO } from '../../../dto/hourly-mats-apportioned-emissions.dto';
import { ReadStream } from 'fs';

@Injectable()
export class HourlyMatsApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitMatsDataRepository)
    private readonly repository: HourUnitMatsDataRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamService,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<HourUnitMatsDataView[]> {
    let entities: HourUnitMatsDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.mats.hourly.data.aggregation.unit),
    );
    req.res.setHeader(
      excludableColumnHeader,
      JSON.stringify(fieldMappings.emissions.mats.hourly.excludableColumns),
    );

    return entities;
  }

  async streamEmissions(
    req: Request,
    params: StreamHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const query = this.repository.getStreamQuery(params);
    let stream: ReadStream = await this.streamService.getStream(query);

    req.on('close', () => {
      stream.emit('end');
    });

    req.res.setHeader(
      fieldMappingHeader,
      JSON.stringify(fieldMappings.emissions.mats.hourly.data.aggregation.unit),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeHourlyMatsApportionedEmissions);
        const dto = plainToClass(HourlyMatsApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const fieldMappingsList = params.exclude
        ? fieldMappings.emissions.mats.hourly.data.aggregation.unit.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.emissions.mats.hourly.data.aggregation.unit;
      const toCSV = new PlainToCSV(fieldMappingsList);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="hourly-mats-emissions-${uuid()}.csv"`,
      });
    }
    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="hourly-mats-emissions-${uuid()}.json"`,
    });
  }
}
