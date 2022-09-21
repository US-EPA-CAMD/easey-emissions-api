import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocation } from 'src/entities/workspace/monitor-location.entity';
import { LocationIdentifiers } from 'src/interfaces/location-identifiers.interface';
import { MonitorPlanWorkspaceRepository } from './monitor-plan-repository';
import { MonitorPlan } from 'src/entities/workspace/monitor-plan.entity';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class MonitorPlanChecksService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private readonly monitorPlanRepository: MonitorPlanWorkspaceRepository,
  ) {}

  async runChecks(locations: LocationIdentifiers[]): Promise<string[]>{
    const errorList: string[] = [];
    const import22Errors = await this.import22BC(locations)
    errorList.push(...import22Errors) 

    return errorList;
  }

  async import22BC(locations: LocationIdentifiers[]): Promise<string[]> {
    const errorList: string[] = [];
    // const monitorLocationIds = dbMonitorLocations.map(ml => ml.id)
    const monitorLocationIds = locations
      .filter(l => !!l.locationId)
      .map(l => l.locationId);

    console.log(monitorLocationIds);
    const dbMonitorPlans: MonitorPlan[] = await this.monitorPlanRepository.getMonitorPlansByLocationIds(
      monitorLocationIds,
    );
    
    console.log("dbMonitorPlans");
    console.log(dbMonitorPlans)
    const monLocIdsFromMonPlans = dbMonitorPlans
      .map(mp => mp.locations)
      .flat()
      .map(ml => ml.id);

    // Here, we are comparing the monitor location of the uploaded unit/stack ids and making sure there is
    // a monitor plan for the location.
    const invalidUnitStackLocations = locations.map(l => {
      // if monitor location id uploaded doesn't have a monitor plan for it, then return that unit/stack
      if (!monLocIdsFromMonPlans.includes(l.locationId))
        return l.unitId ? l.unitId : l.stackPipeId;
    });

    if (invalidUnitStackLocations.length > 0) {
      errorList.push(
        CheckCatalogService.formatResultMessage('IMPORT-22-B', {
          invalid: invalidUnitStackLocations,
        }),
      );
    } else {
      const invalidUnitNamePrefixes = ['CS', 'MS', 'CP', 'MP'];
      const invalidUnitIds = locations
        .filter(l => invalidUnitNamePrefixes.includes(l.unitId.substring(0, 2)))
        .map(l => l.unitId);

      if (invalidUnitIds.length > 0) {
        errorList.push(
          CheckCatalogService.formatResultMessage('IMPORT-22-C', {
            invalid: invalidUnitIds,
          }),
        );
      }
    }

    return errorList;
  }
}
