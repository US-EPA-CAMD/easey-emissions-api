import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

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
    let isUnion = false;
    let isArchived = false;

    const archivedYear = await this.programYearRepository.lastArchivedYear();
    const archivedYears = applicableApportionedEmissionsParamsDTO.year.map(
      el => Number(el) <= archivedYear,
    );

    isArchived = archivedYears.includes(true);
    this.logger.info(
      `Query params ${
        isArchived ? 'contains' : 'do not contain'
      } archived years`,
    );
    isUnion = isArchived && archivedYears.includes(false);
    this.logger.info(
      `Query params ${
        isUnion ? 'contains' : 'do not contain'
      } archived & non-archived years`,
    );

    let query;
    try {
      this.logger.info(
        'Getting all applicable apportioned emissions attributes',
      );
      query = await this.programYearRepository.getApplicableApportionedEmissionsAttributes(
        applicableApportionedEmissionsParamsDTO,
        isArchived,
        isUnion,
      );
      this.logger.info('Got all applicable apportioned emissions attributes');
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return query.map(item => {
      return plainToClass(ApplicableApportionedEmissionsAttributesDTO, item, {
        enableImplicitConversion: true,
      });
    });
  }
}
