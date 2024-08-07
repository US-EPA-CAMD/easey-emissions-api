import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { Request } from 'express';

import {
  excludableColumnHeader,
  fieldMappingHeader,
  fieldMappings,
} from '../../../constants/field-mappings';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';

@Injectable()
export class HourlyMatsApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: HourUnitMatsDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<HourUnitMatsDataView[]> {
    let entities: HourUnitMatsDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      throw new EaseyException(
        new Error(e.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  // async streamEmissions(
  //   req: Request,
  //   params: StreamHourlyMatsApportionedEmissionsParamsDTO,
  // ): Promise<StreamableFile> {
  //   const query = this.repository.getStreamQuery(params);
  //   let stream: ReadStream = await this.streamService.getStream(query);

  //   req.on('close', () => {
  //     stream.emit('end');
  //   });

  //   req.res.setHeader(
  //     fieldMappingHeader,
  //     JSON.stringify(fieldMappings.emissions.mats.hourly.data.aggregation.unit),
  //   );

  //   const toDto = new Transform({
  //     objectMode: true,
  //     transform(data, _enc, callback) {
  //       data = exclude(data, params, ExcludeHourlyMatsApportionedEmissions);
  //       const dto = plainToClass(HourlyMatsApportionedEmissionsDTO, data, {
  //         enableImplicitConversion: true,
  //       });
  //       const date = new Date(dto.date);
  //       dto.date = date.toISOString().split('T')[0];
  //       callback(null, dto);
  //     },
  //   });

  //   if (req.headers.accept === 'text/csv') {
  //     const fieldMappingsList = params.exclude
  //       ? fieldMappings.emissions.mats.hourly.data.aggregation.unit.filter(
  //           item => !params.exclude.includes(item.value),
  //         )
  //       : fieldMappings.emissions.mats.hourly.data.aggregation.unit;
  //     const toCSV = new PlainToCSV(fieldMappingsList);
  //     return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
  //       type: req.headers.accept,
  //       disposition: `attachment; filename="hourly-mats-emissions-${uuid()}.csv"`,
  //     });
  //   }
  //   const objToString = new PlainToJSON();
  //   return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
  //     type: req.headers.accept,
  //     disposition: `attachment; filename="hourly-mats-emissions-${uuid()}.json"`,
  //   });
  // }
}
