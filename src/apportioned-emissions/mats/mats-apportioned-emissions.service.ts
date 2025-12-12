import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { plainToClass } from 'class-transformer';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { ApplicableApportionedEmissionsAttributesDTO } from '../../dto/applicable-apportioned-emissions-attributes.dto';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-apportioned-emissions-attributes.params.dto';
import { UnitFactRepository } from '../unit-fact.repository';

@Injectable()
export class MatsApportionedEmissionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('MatsApportionedEmissionsService');
  }

  async getApplicableApportionedEmissionsAttributes(
    applicableApportionedEmissionsParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableApportionedEmissionsAttributesDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      let query;
      try {
        this.logger.log(
          'Getting all applicable apportioned emissions attributes',
        );
        const unitFactRepository = new UnitFactRepository(replicaManager);
        query = await unitFactRepository.getApplicableApportionedEmissionsAttributes(
          applicableApportionedEmissionsParamsDTO.year,
          true,
        );
        this.logger.log('Got all applicable apportioned emissions attributes');
      } catch (e) {
        throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return query.map(item => {
        return plainToClass(ApplicableApportionedEmissionsAttributesDTO, item, {
          enableImplicitConversion: true,
        });
      });
    });
  }
}
