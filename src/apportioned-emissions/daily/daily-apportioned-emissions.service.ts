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

import { fieldMappings } from '../../constants/field-mappings';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsDTO } from '../../dto/daily-apportioned-emissions.dto';
import {
  PaginatedDailyApportionedEmissionsParamsDTO,
  StreamDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';
import { ReadStream } from 'fs';

@Injectable()
export class DailyApportionedEmissionsService {
  constructor(
    @InjectRepository(DayUnitDataRepository)
    private readonly repository: DayUnitDataRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamService,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let entities: DayUnitDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily),
    );

    return entities;
  }

  async streamEmissions(
    req: Request,
    params: StreamDailyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const query = this.repository.getStreamQuery(params);
    let stream: ReadStream = await this.streamService.getStream(query);

    req.on('close', () => {
      stream.destroy();
      stream = null;
    });

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeApportionedEmissions);
        const dto = plainToClass(DailyApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        const date = new Date(dto.date);
        dto.date = date.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const fieldMappingsList = params.exclude
        ? fieldMappings.emissions.daily.filter(
            item => !params.exclude.includes(item.value),
          )
        : fieldMappings.emissions.daily;
      const toCSV = new PlainToCSV(fieldMappingsList);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="daily-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="daily-emissions-${uuid()}.json"`,
    });
  }
}
