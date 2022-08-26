import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
  constructor(
    private readonly repository: DerivedHourlyValueWorkspaceRepository,
  ) {}

  async export(monitoringLocationIds: string[]) {
    return this.repository.export(monitoringLocationIds);
  }
}
