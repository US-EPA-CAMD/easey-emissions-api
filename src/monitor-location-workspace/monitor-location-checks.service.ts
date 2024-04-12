import { Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { DailyBackstopImportDTO } from '../dto/daily-backstop.dto';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HourlyOperatingImportDTO } from '../dto/hourly-operating.dto';
import { LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { Nsps4tSummaryImportDTO } from '../dto/nsps4t-summary.dto';
import { SorbentTrapImportDTO } from '../dto/sorbent-trap.dto';
import { SummaryValueImportDTO } from '../dto/summary-value.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { isUndefinedOrNull } from '../utils/utils';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

// the following types have componentId field (and possibly other fields later on) which is needed for addLocation()
type ForLocationType =
  | HourlyOperatingImportDTO
  | DailyTestSummaryImportDTO
  | WeeklyTestSummaryImportDTO
  | SorbentTrapImportDTO
  | LongTermFuelFlowImportDTO
  | SummaryValueImportDTO
  | Nsps4tSummaryImportDTO
  | DailyBackstopImportDTO;

@Injectable()
export class MonitorLocationChecksService {
  constructor(
    private readonly repository: MonitorLocationWorkspaceRepository,
  ) {}

  processLocations(payload: EmissionsImportDTO): LocationIdentifiers[] {
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: ForLocationType) => {
      const unitId = i['unitId'];
      const stackPipeId = i['stackPipeId'];
      let location = locations.find(l => {
        const locationUnitId = l['unitId'];
        const locationStackPipeId = l['stackPipeId'];
        if (unitId) return locationUnitId === unitId;
        if (stackPipeId) return locationStackPipeId === stackPipeId;
      });

      if (!location) {
        location = {
          unitId: i.unitId,
          locationId: null,
          stackPipeId: i['stackPipeId'],
          componentIds: new Set<string>(),
          monitoringSystemIds: new Set<string>(),
          ltffMonitoringSystemIds: new Set<string>(),
        };

        locations.push(location);
      }

      if ('monitorHourlyValueData' in i)
        i.monitorHourlyValueData.forEach(d => {
          !d.componentId || location.componentIds.add(d.componentId);
          !d.monitoringSystemId ||
            location.monitoringSystemIds.add(d.monitoringSystemId);
        });

      if ('matsMonitorHourlyValueData' in i)
        i.matsMonitorHourlyValueData.forEach(d => {
          !d.componentId || location.componentIds.add(d.componentId);
          !d.monitoringSystemId ||
            location.monitoringSystemIds.add(d.monitoringSystemId);
        });

      if ('hourlyGFMData' in i)
        i.hourlyGFMData.forEach(d => {
          !d.componentId || location.componentIds.add(d.componentId);
        });

      if ('samplingTrainData' in i)
        i.samplingTrainData.forEach(d => {
          !d.componentId || location.componentIds.add(d.componentId);
        });

      if ('derivedHourlyValueData' in i)
        i.derivedHourlyValueData.forEach(d => {
          !d.monitoringSystemId ||
            location.monitoringSystemIds.add(d.monitoringSystemId);
        });

      if ('hourlyFuelFlowData' in i) {
        i.hourlyFuelFlowData.forEach(d => {
          !d.monitoringSystemId ||
            location.monitoringSystemIds.add(d.monitoringSystemId);

          // Would monitoringSystemId ever be different between HourlyFuelFlowData and HourlyParameterFuelFlowData?
          // The below forEach could probably be removed if they will always be the same, regardless
          // because it's being added to a Set, there won't be any repeating IDs.
          d.hourlyParameterFuelFlowData?.forEach(h => {
            !d.monitoringSystemId ||
              location.monitoringSystemIds.add(d.monitoringSystemId);
          });
        });
      }

      // for the top level dtos like WeeklyTestSummary and DailyTestSummary
      if ('componentId' in i)
        !i.componentId || location.componentIds.add(i.componentId);

      if ('monitoringSystemId' in i)
        !i.monitoringSystemId ||
          location.monitoringSystemIds.add(i.monitoringSystemId);

      if ('longTermFuelFlowValue' in i)
        !i.monitoringSystemId ||
          location.ltffMonitoringSystemIds.add(i.monitoringSystemId);
    };

    payload?.dailyTestSummaryData?.forEach(i => addLocation(i));
    payload?.hourlyOperatingData?.forEach(i => addLocation(i));
    payload?.weeklyTestSummaryData?.forEach(i => addLocation(i));
    payload?.sorbentTrapData?.forEach(i => addLocation(i));
    payload?.longTermFuelFlowData?.forEach(i => addLocation(i));
    payload?.summaryValueData?.forEach(i => addLocation(i));
    payload?.dailyEmissionData?.forEach(i => addLocation(i));
    payload?.nsps4tSummaryData?.forEach(i => addLocation(i));
    payload?.dailyBackstopData?.forEach(i => addLocation(i));

    return locations;
  }

  async runChecks(
    payload: EmissionsImportDTO,
  ): Promise<[LocationIdentifiers[], string[]]> {
    const errorList = [];
    const orisCode = payload.orisCode;

    // contains ids from the upload
    const locations: LocationIdentifiers[] = this.processLocations(payload);

    // IMPORT-22-A
    if (locations.length === 0) {
      errorList.push(CheckCatalogService.formatResultMessage('IMPORT-22-A'));
      return [locations, errorList];
    }

    const dbLocations: MonitorLocation[] = await this.repository.getLocationsByUnitStackPipeIds(
      orisCode,
      locations.filter(i => !isUndefinedOrNull(i.unitId)).map(i => i.unitId),
      locations
        .filter(i => !isUndefinedOrNull(i.stackPipeId))
        .map(i => i.stackPipeId),
    );

    locations.forEach(location => {
      const dbLocation = dbLocations.find(
        i =>
          i?.unit?.name === location?.unitId ||
          i?.stackPipe?.name === location?.stackPipeId,
      );

      if (dbLocation) {
        location.locationId = dbLocation.id;

        const dbComponentIds = dbLocation?.components?.map(i => i.componentId);
        const dbMonitoringSystemIds = dbLocation?.monitorSystems?.map(
          i => i.monitoringSystemId,
        );

        location.componentIds.forEach(componentId => {
          if (!dbComponentIds?.includes(componentId)) {
            // IMPORT-27 All EM Components Present in the Database (Result A)
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-27-A', {
                componentID: componentId,
              }),
            );
          }
        });

        // IMPORT-26-A All EM Systems Present in the Production Database
        location.monitoringSystemIds.forEach(monitoringSystemId => {
          if (!dbMonitoringSystemIds?.includes(monitoringSystemId)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-26-A', {
                systemID: monitoringSystemId,
              }),
            );
          }
        });

        // IMPORT-26-B All EM Systems Present in the Production Database
        location.ltffMonitoringSystemIds.forEach(monitoringSystemId => {
          if (!dbMonitoringSystemIds?.includes(monitoringSystemId)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-26-A', {
                systemID: monitoringSystemId,
              }),
            );
          } else {
            const validLtffSystemCodes = ['LTOL', 'LTGS'];
            const monitoringSystem = dbLocation.monitorSystems.find(
              ms => ms.monitoringSystemId === monitoringSystemId,
            );
            if (
              !validLtffSystemCodes.includes(monitoringSystem?.systemTypeCode)
            ) {
              errorList.push(
                CheckCatalogService.formatResultMessage('IMPORT-26-B', {
                  key: monitoringSystemId,
                }),
              );
            }
          }
        });
      }
    });

    return [locations, errorList];
  }
}
