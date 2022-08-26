import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceMap } from './derived-hourly-value-workspace.map';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
  constructor(
    private readonly repository: DerivedHourlyValueWorkspaceRepository,
    private readonly map: DerivedHourlyValueWorkspaceMap,
  ) {}

  async export(monitoringLocationIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(
      monitoringLocationIds,
    );

    const promises = derivedHourlyValueData.map(data => {
      return this.map.one(data);
    });

    return Promise.all(promises);
  }
}
