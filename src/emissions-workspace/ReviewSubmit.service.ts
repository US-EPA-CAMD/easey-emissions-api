import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { In } from 'typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { EmissionsReviewSubmitGlobalRepository } from './ReviewSubmitGlobal.repository';

@Injectable()
export class ReviewSubmitService {
  constructor(
    @InjectRepository(EmissionsReviewSubmitRepository)
    private readonly workspaceRepository: EmissionsReviewSubmitRepository,

    @InjectRepository(EmissionsReviewSubmitGlobalRepository)
    private readonly globalRepository: EmissionsReviewSubmitGlobalRepository,

    private readonly map: EmissionsReviewSubmitMap,
  ) {}

  async getEmissionsRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true
  ): Promise<EmissionsReviewSubmitDTO[]> {
    if (!quarters || quarters.length === 0) {
      return [];
    }

    let repository; 
    if(isWorkspace){
      repository = this.workspaceRepository;
    }else{
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
