import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyCalibration } from '../entities/workspace/daily-calibration.entity';

@Injectable()
export class DailyCalibrationWorkspaceRepository extends Repository<
  DailyCalibration
> {
  constructor(entityManager: EntityManager) {
    super(DailyCalibration, entityManager);
  }
}
