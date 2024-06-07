import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { In } from 'typeorm';

import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitGlobalRepository } from './ReviewSubmitGlobal.repository';

@Injectable()
export class ReviewSubmitService {
  constructor(
    private readonly workspaceRepository: EmissionsReviewSubmitRepository,
    private readonly globalRepository: EmissionsReviewSubmitGlobalRepository,
    private readonly map: EmissionsReviewSubmitMap,
  ) {}

  async getEmissionsRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
  ): Promise<EmissionsReviewSubmitDTO[]> {
    if (!quarters || quarters.length === 0) {
      return [];
    }

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
    }

    try {
      if (monPlanIds && monPlanIds.length > 0) {
        return this.map.many(
          await repository.find({
            where: {
              monPlanId: In(monPlanIds),
              periodAbbreviation: In(quarters),
            },
          }),
        );
      }
      return this.map.many(
        await repository.find({
          where: { orisCode: In(orisCodes), periodAbbreviation: In(quarters) },
        }),
      );
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
