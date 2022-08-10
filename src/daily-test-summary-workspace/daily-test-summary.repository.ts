import { Repository, EntityRepository } from 'typeorm';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';

@EntityRepository(DailyTestSummary)
export class DailyTestSummaryWorkspaceRepository extends Repository<DailyTestSummary> {
}
