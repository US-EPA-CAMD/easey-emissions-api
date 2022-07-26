import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { ApplicableMatsApportionedEmissionsAttributesDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes.dto';
import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class MatsApportionedEmissionsService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(HourUnitMatsDataRepository)
    private readonly repository: HourUnitMatsDataRepository,
  ) {}

  async getApplicableEmissions(
    params: ApplicableMatsApportionedEmissionsAttributesParamsDTO,
  ): Promise<ApplicableMatsApportionedEmissionsAttributesDTO[]> {
    let isUnion = false;
    let isArchived = false;
    const archivedDate = await this.repository.lastArchivedDate();

    isArchived =
      new Date(params.beginDate) <= archivedDate ||
      new Date(params.endDate) <= archivedDate;
    this.logger.info(
      `Query params ${
        isArchived ? 'contains' : 'do not contain'
      } archived dates`,
    );
    isUnion =
      isArchived &&
      (new Date(params.beginDate) > archivedDate ||
        new Date(params.endDate) > archivedDate);
    this.logger.info(
      `Query ${isUnion ? 'contains' : 'does not contain'} union`,
    );

    let entities;
    try {
      this.logger.info(
        'Getting all applicable mats apportioned emissions attributes',
      );
      entities = await this.repository.getApplicableEmissions(
        params,
        isArchived,
        isUnion,
      );
      this.logger.info(
        'Got all applicable mats apportioned emissions attributes',
      );
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return entities.map(item => {
      const dto = plainToClass(
        ApplicableMatsApportionedEmissionsAttributesDTO,
        item,
        {
          enableImplicitConversion: true,
        },
      );
      const date = new Date(dto.date);
      dto.date = date.toISOString().split('T')[0];
      return dto;
    });
  }
}
