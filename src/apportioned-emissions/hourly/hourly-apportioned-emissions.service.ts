import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { PaginatedHourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';

@Injectable()
export class HourlyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(HourUnitDataRepository)
    private readonly repository: HourUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let entities: HourUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.hourly,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.hourly),
    );

    return entities;
  }
}
