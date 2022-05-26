import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { PaginatedAnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

@Injectable()
export class AnnualApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AnnualUnitDataRepository)
    private readonly repository: AnnualUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let entities: AnnualUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.annual,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.annual),
    );

    return entities;
  }
}
