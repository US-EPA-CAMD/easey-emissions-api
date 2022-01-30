import { v4 as uuid } from 'uuid';
import { Request } from 'express';
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
import { AnnualUnitData } from '../../entities/annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsDTO } from '../../dto/annual-apportioned-emissions.dto';
import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
import { 
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@Injectable()
export class AnnualApportionedEmissionsService {
  constructor(
    @InjectRepository(AnnualUnitDataRepository)
    private readonly repository: AnnualUnitDataRepository,
    private readonly map: AnnualApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualApportionedEmissionsDTO[]> {
    let entities: AnnualUnitData[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    return this.map.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.annual);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="annual-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="annual-emissions-${uuid()}.json"`,
    });
  }
}
