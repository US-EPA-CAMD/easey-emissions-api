import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { ApplicableApportionedEmissionsAttributesDTO } from '../dto/applicable-apportioned-emissions-attributes.dto';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../dto/applicable-apportioned-emissions-attributes.params.dto';
import { UnitFactRepository } from './unit-fact.repository';

@Injectable()
export class ApportionedEmissionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly unitFactRepository: UnitFactRepository,
  ) {
    this.logger.setContext('ApportionedEmissionsService');
  }

  async getApplicableApportionedEmissionsAttributes(
    applicableApportionedEmissionsParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      let query;
      try {
        this.logger.log(
          'Getting all applicable apportioned emissions attributes',
        );
        query = await this.unitFactRepository.getApplicableApportionedEmissionsAttributes(
          applicableApportionedEmissionsParamsDTO.year,
        );
        this.logger.log('Got all applicable apportioned emissions attributes');
      } catch (e) {
        throw new EaseyException(
          new Error(e.message),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return query.map(item => {
        return plainToClass(ApplicableApportionedEmissionsAttributesDTO, item, {
          enableImplicitConversion: true,
        });
      });
    });
  }
}
