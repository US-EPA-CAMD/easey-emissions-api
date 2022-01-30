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
import { QuarterUnitData } from '../../entities/quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsDTO } from '../../dto/quarterly-apportioned-emissions.dto';
import { QuarterlyApportionedEmissionsMap } from '../../maps/quarterly-apportioned-emissions.map';
import { 
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  constructor(
    @InjectRepository(QuarterUnitDataRepository)
    private readonly repository: QuarterUnitDataRepository,
    private readonly map: QuarterlyApportionedEmissionsMap,
    private readonly logger: Logger,
  ) { }

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterlyApportionedEmissionsDTO[]> {
    let entities: QuarterUnitData[];

    try {
      entities = await this.repository.getEmissions(req, params);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.quarterly),
    );

    return this.map.many(entities);
  }  

  async streamEmissions(
    req: Request,
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<StreamableFile> {
    const stream = await this.repository.streamEmissions(params);

    if (req.headers.accept === "text/csv") {
      const toCSV = new PlainToCSV(fieldMappings.emissions.quarterly);
      return new StreamableFile(stream.pipe(toCSV), {
        disposition: `attachment; filename="quarterly-emissions-${uuid()}.csv"`,
      });
    }

    const objToString = new PlainToJSON();
    return new StreamableFile(stream.pipe(objToString), {
      disposition: `attachment; filename="quarterly-emissions-${uuid()}.json"`,
    });
  }
}
