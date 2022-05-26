import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { PaginatedMonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

@Injectable()
export class MonthlyApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonthUnitDataRepository)
    private readonly repository: MonthUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let entities: MonthUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.monthly,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.monthly),
    );

    return entities;
  }
}
