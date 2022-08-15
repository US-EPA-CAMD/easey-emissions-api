import { DailyCalibration } from '../entities/daily-calibration.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DailyCalibration)
export class DailyCalibrationRepository extends Repository<DailyCalibration> {}
