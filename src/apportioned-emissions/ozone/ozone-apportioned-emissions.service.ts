import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { fieldMappings } from '../../constants/field-mappings';
import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { PaginatedOzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';

@Injectable()
export class OzoneApportionedEmissionsService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(OzoneUnitDataRepository)
    private readonly repository: OzoneUnitDataRepository,
  ) {}

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let entities: OzoneUnitDataView[];

    try {
      entities = await this.repository.getEmissions(
        req,
        fieldMappings.emissions.ozone,
        params
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message);
    }

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings.emissions.ozone),
    );

    return entities;
  }
}
