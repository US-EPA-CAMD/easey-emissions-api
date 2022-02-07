import { Repository, EntityRepository } from 'typeorm';
import { EmissionSubmissionsProgress } from '../entities/emissions-submission-progress.entity';

@EntityRepository(EmissionSubmissionsProgress)
export class EmissionsRepository extends Repository<
  EmissionSubmissionsProgress
> {
  async getSubmissionProgress(periodDate: Date, submissionDays: number) {
    return this.createQueryBuilder('submissions')
      .where(
        `'${periodDate}' BETWEEN submissions.end_date + interval '1' day AND
        submissions.end_date + interval '${submissionDays}' day`,
      )
      .getOne();
  }
}
