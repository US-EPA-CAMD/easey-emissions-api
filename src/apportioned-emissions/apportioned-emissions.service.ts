import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { ProgramYearDimRepository } from './program-year-dim.repository';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from '../dto/applicable-apportioned-emissions-attributes.dto';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(ProgramYearDimRepository)
    private readonly programYearRepository: ProgramYearDimRepository,
  ) {}

  async getApplicableApportionedEmissionsAttributes(
    applicableApportionedEmissionsParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    let query;
    try {
      this.logger.info(
        'Getting all applicable apportioned emissions attributes',
      );
      query = await this.programYearRepository.getApplicableApportionedEmissionsAttributes(
        applicableApportionedEmissionsParamsDTO.year
      );
      this.logger.info('Got all applicable apportioned emissions attributes');
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return query.map(item => {
      return plainToClass(ApplicableApportionedEmissionsAttributesDTO, item, {
        enableImplicitConversion: true,
      });
    });
  }
}
