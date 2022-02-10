import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  Injectable,
  StreamableFile,
  InternalServerErrorException
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  PlainToCSV,
  PlainToJSON
} from '@us-epa-camd/easey-common/transforms';

import { fieldMappings } from '../../constants/field-mappings';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import { 
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  constructor(
    @InjectRepository(QuarterUnitDataRepository)
    private readonly repository: QuarterUnitDataRepository,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let entities: QuarterUnitDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.quarterly),
    );

    return entities;
  }  

  async streamEmissions(
    req: Request,
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.quarterly),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(
          QuarterlyApportionedEmissionsDTO,
          data,
          { enableImplicitConversion: true }
        );
        callback(null, dto);
      }
    });

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.quarterly);
      return new StreamableFile(stream
        .pipe(toDto)
        .pipe(toCSV), {
          type: req.headers.accept,
          disposition: `attachment; filename="quarterly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream
      .pipe(toDto)
      .pipe(objToString), {
        type: req.headers.accept,
        disposition: `attachment; filename="quarterly-emissions-${uuid()}.json"`,
    });
  }
}
