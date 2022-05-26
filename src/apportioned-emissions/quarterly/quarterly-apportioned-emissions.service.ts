import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';

@Injectable()
export class QuarterlyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(QuarterUnitDataRepository)
    private readonly repository: QuarterUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let entities: QuarterUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.quarterly,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.quarterly),
    );

    return entities;
  }
}
