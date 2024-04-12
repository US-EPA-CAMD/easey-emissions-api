import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyCalibration } from '../entities/daily-calibration.entity';

@Injectable()
export class DailyCalibrationRepository extends Repository<DailyCalibration> {
  constructor(entityManager: EntityManager) {
    super(DailyCalibration, entityManager);
  }
}
