import { DailyCalibration } from '../entities/workspace/daily-calibration.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DailyCalibration)
export class DailyCalibrationWorkspaceRepository extends Repository<
  DailyCalibration
> {}
