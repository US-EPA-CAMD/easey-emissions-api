import { Repository, EntityRepository } from 'typeorm';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';

@EntityRepository(EmissionsSubmissionsProgress)
export class EmissionsSubmissionsProgressRepository extends Repository<
  EmissionsSubmissionsProgress
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
