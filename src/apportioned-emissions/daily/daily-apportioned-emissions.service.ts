import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { PaginatedDailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

@Injectable()
export class DailyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(DayUnitDataRepository)
    private readonly repository: DayUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let entities: DayUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.daily,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.daily),
    );

    return entities;
  }
}
