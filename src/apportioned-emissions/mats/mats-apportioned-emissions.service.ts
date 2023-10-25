import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from '../../dto/applicable-apportioned-emissions-attributes.dto';
import { UnitFactRepository } from '../unit-fact.repository';

@Injectable()
export class MatsApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UnitFactRepository)
    private readonly unitFactRepository: UnitFactRepository
  ) {}

  async getApplicableApportionedEmissionsAttributes(
    applicableApportionedEmissionsParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    let query;
    try {
      this.logger.log(
        'Getting all applicable apportioned emissions attributes',
      );
      query = await this.unitFactRepository.getApplicableApportionedEmissionsAttributes(
        applicableApportionedEmissionsParamsDTO.year, true
      );
      this.logger.log('Got all applicable apportioned emissions attributes');
    } catch (e) {
      throw new EaseyException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return query.map(item => {
      return plainToClass(ApplicableApportionedEmissionsAttributesDTO, item, {
        enableImplicitConversion: true,
      });
    });
  }
}
