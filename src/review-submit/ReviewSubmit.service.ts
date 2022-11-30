import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { In } from 'typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

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
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        return this.map.many(
          await this.repository.find({
            where: {
              monPlanIdentifier: In(monPlanIds),
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
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
