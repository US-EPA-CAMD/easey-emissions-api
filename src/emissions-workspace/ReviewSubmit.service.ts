import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { In } from 'typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';

@Injectable()
export class ReviewSubmitService {
  constructor(
    @InjectRepository(EmissionsReviewSubmitRepository)
    private readonly repository: EmissionsReviewSubmitRepository,
    private readonly map: EmissionsReviewSubmitMap,
  ) {}

  async getEmissionsRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
  ): Promise<EmissionsReviewSubmitDTO[]> {
    if (!quarters || quarters.length === 0) {
      return [];
    }

    try {
      if (monPlanIds && monPlanIds.length > 0) {
        return this.map.many(
          await this.repository.find({
            where: {
              monPlanId: In(monPlanIds),
              periodAbbreviation: In(quarters),
            },
          }),
        );
      }
      return this.map.many(
        await this.repository.find({
          where: { orisCode: In(orisCodes), periodAbbreviation: In(quarters) },
        }),
      );
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
