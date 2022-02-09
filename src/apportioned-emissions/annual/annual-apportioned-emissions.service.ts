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

import { fieldMappings } from '../../constants/field-mappings';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import {
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@Injectable()
export class AnnualApportionedEmissionsService {
  constructor(
    @InjectRepository(AnnualUnitDataRepository)
    private readonly repository: AnnualUnitDataRepository,
    //private readonly map: AnnualApportionedEmissionsMap,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let entities: AnnualUnitDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    return entities;
  }

  async streamEmissions(
    req: Request,
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    const toDto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(AnnualApportionedEmissionsDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    if (req.headers.accept === 'text/csv') {
      const toCSV = new PlainToCSV(fieldMappings.emissions.annual);
      return new StreamableFile(stream.pipe(toDto).pipe(toCSV), {
        type: req.headers.accept,
        disposition: `attachment; filename="annual-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(toDto).pipe(objToString), {
      type: req.headers.accept,
      disposition: `attachment; filename="annual-emissions-${uuid()}.json"`,
    });
  }
}
