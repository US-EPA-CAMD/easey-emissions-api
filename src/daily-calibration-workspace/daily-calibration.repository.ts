import { Repository, EntityRepository } from 'typeorm';
import { DailyCalibration } from '../entities/daily-calibration.entity';

@EntityRepository(DailyCalibration)
export class DailyCalibrationWorkspaceRepository extends Repository<DailyCalibration> {
}
