import { Injectable } from '@nestjs/common';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { In } from 'typeorm';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';

@Injectable()
export class MatsDerivedHourlyValueWorkspaceService {
  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    const results = await this.repository.find({
      where: { hourId: In(hourIds) },
    });
    return this.map.many(results);
  }
}
