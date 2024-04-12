import { Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MonitorPlanWorkspaceRepository } from './monitor-plan-repository';

@Injectable()
export class MonitorPlanChecksService {
  constructor(
    private readonly monitorPlanRepository: MonitorPlanWorkspaceRepository,
  ) {}

  async runChecks(locations: LocationIdentifiers[]): Promise<string[]> {
    const errorList: string[] = [];
    const import22Errors = await this.import22BC(locations);
    errorList.push(...import22Errors);

    return errorList;
  }

  async import22BC(locations: LocationIdentifiers[]): Promise<string[]> {
    const errorList: string[] = [];
    const invalidUnitNamePrefixes = ['CS', 'MS', 'CP', 'MP'];

    if (locations?.length === 0) return errorList;

    const invalidUnitIds = locations
      .filter(l => l?.unitId)
      .filter(l => invalidUnitNamePrefixes.includes(l.unitId.substring(0, 2)))
      .map(l => l.unitId);

    if (invalidUnitIds.length > 0) {
      errorList.push(
        CheckCatalogService.formatResultMessage('IMPORT-22-C', {
          invalid: invalidUnitIds,
        }),
      );
    }

    const monitorLocationIds = locations
      .filter(l => l?.locationId)
      .map(l => l.locationId);

    if (monitorLocationIds.length === 0) return errorList;

    const dbMonitorPlans: MonitorPlan[] = await this.monitorPlanRepository.getMonitorPlansByLocationIds(
      monitorLocationIds,
    );
    let monLocIdsFromMonPlans = dbMonitorPlans
      .map(mp => mp.locations)
      .flat()
      .map(ml => ml.id);

    monLocIdsFromMonPlans = [...new Set(monLocIdsFromMonPlans)];

    // Here, we are comparing the monitor location of the uploaded unit/stack ids and making sure there is
    // a monitor plan for the location.
    const invalidUnitStackLocations = locations
      .map(l => {
        // if the monitor location id from the unit/stack uploaded doesn't have a monitor plan for it, then return that unit/stack
        if (!monLocIdsFromMonPlans.includes(l.locationId))
          return l.unitId ? l.unitId : l.stackPipeId;
      })
      .filter(i => i !== undefined);

    if (invalidUnitStackLocations.length > 0) {
      errorList.push(
        CheckCatalogService.formatResultMessage('IMPORT-22-B', {
          invalid: invalidUnitStackLocations,
        }),
      );
    }

    return errorList;
  }
}
