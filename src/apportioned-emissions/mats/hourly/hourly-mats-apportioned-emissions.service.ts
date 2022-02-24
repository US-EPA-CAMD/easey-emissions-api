import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../../constants/field-mappings';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { PaginatedHourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';

@Injectable()
export class HourlyMatsApportionedEmissionsService {
  constructor(
    @InjectRepository(HourUnitMatsDataRepository)
    private readonly repository: HourUnitMatsDataRepository,
    private readonly logger: Logger,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<HourUnitMatsDataView[]> {
    let entities: HourUnitMatsDataView[];

    try {
      entities = await this.repository.getEmissions(req, params);
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
