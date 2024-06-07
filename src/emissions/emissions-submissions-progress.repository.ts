import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';

@Injectable()
export class EmissionsSubmissionsProgressRepository extends Repository<
  EmissionsSubmissionsProgress
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsSubmissionsProgress, entityManager);
  }

  async getSubmissionProgress(periodDate: Date, submissionDays: number) {
    return this.createQueryBuilder('submissions')
      .where(
        `'${periodDate}' BETWEEN submissions.end_date + interval '1' day AND
        submissions.end_date + interval '${submissionDays}' day`,
      )
      .getOne();
  }
}
