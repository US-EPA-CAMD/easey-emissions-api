import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HourlyOperatingImportDTO } from '../dto/hourly-operating.dto';
import { SorbentTrapImportDTO } from '../dto/sorbent-trap.dto';
import { WeeklyTestSummaryImportDTO } from '../dto/weekly-test-summary.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

// the following types have componentId field (and possibly other fields later on) which is needed for addLocation()
type ForLocationType =
  | HourlyOperatingImportDTO
  | DailyTestSummaryImportDTO
  | WeeklyTestSummaryImportDTO
  | SorbentTrapImportDTO;

@Injectable()
export class MonitorLocationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly repository: MonitorLocationWorkspaceRepository,
  ) {}

  processLocations(payload: EmissionsImportDTO): LocationIdentifiers[] {
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: ForLocationType) => {
      const location = locations.find(
        l => l?.unitId === i?.unitId || l?.stackPipeId === i?.stackPipeId,
      );

      if (location) {
        if ('monitorHourlyValueData' in i)
          i.monitorHourlyValueData.forEach(d => {
            location.componentIds.add(d.componentId);
          });

        if ('matsMonitorHourlyValueData' in i)
          i.matsMonitorHourlyValueData.forEach(d => {
            location.componentIds.add(d.componentId);
          });

        if ('hourlyGFMData' in i)
          i.hourlyGFMData.forEach(d => {
            location.componentIds.add(d.componentId);
          });

        if ('samplingTrainData' in i)
          i.samplingTrainData.forEach(d => {
            location.componentIds.add(d.componentId);
          });

        // for WeeklyTestSummaryImportDTO and DailyTestSummaryImportDTO
        if ('componentId' in i) location.componentIds.add(i.componentId);
      } else {
        const componentIds = new Set<string>();

        if ('monitorHourlyValueData' in i) {
          i.monitorHourlyValueData.forEach(d => {
            componentIds.add(d.componentId);
          });
        }

        if ('matsMonitorHourlyValueData' in i) {
          i.matsMonitorHourlyValueData.forEach(d => {
            componentIds.add(d.componentId);
          });
        }

        if ('hourlyGFMData' in i) {
          i.hourlyGFMData.forEach(d => {
            componentIds.add(d.componentId);
          });
        }

        if ('samplingTrainData' in i) {
          i.samplingTrainData.forEach(d => {
            componentIds.add(d.componentId);
          });
        }

        // for WeeklyTestSummaryImportDTO and DailyTestSummaryImportDTO
        if ('componentId' in i) componentIds.add(i.componentId);

        locations.push({
          unitId: i.unitId,
          locationId: null,
          stackPipeId: i.stackPipeId,
          componentIds,
        });
      }
    };

    payload?.dailyTestSummaryData?.forEach(i => addLocation(i));
    payload?.hourlyOperatingData?.forEach(i => addLocation(i));
    payload?.weeklyTestSummaryData?.forEach(i => addLocation(i));
    payload?.sorbentTrapData?.forEach(i => addLocation(i));

    return locations;
  }

  async runChecks(
    payload: EmissionsImportDTO,
  ): Promise<[LocationIdentifiers[], string[]]> {
    this.logger.info('Running Unit/Stack Location Checks');

    const errorList = [];
    const orisCode = payload.orisCode;

    const locations: LocationIdentifiers[] = this.processLocations(payload);

    // This could be an import check in which case the below message would have to be updated
    if (locations.length === 0) {
      errorList.push('No location identifiers found in import file');
    }

    const dbLocations: MonitorLocation[] = await this.repository.getLocationsByUnitStackPipeIds(
      orisCode,
      locations.filter(i => i.unitId !== null).map(i => i.unitId),
      locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
    );

    locations.forEach(location => {
      const dbLocation = dbLocations.find(
        i =>
          i?.unit?.name === location?.unitId ||
          i?.stackPipe?.name === location?.stackPipeId,
      );

      if (dbLocation) {
        location.locationId = dbLocation.id;
        const dbComponentIds = dbLocation.components.map(i => i.componentId);

        location.componentIds.forEach(componentId => {
          if (!dbComponentIds.includes(componentId)) {
            // IMPORT-27 All EM Components Present in the Database (Result A)
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-27-A', {
                componentID: componentId,
              }),
            );
          }
        });
      }
    });

    this.logger.info('Completed Unit/Stack Location Checks');
    return [locations, errorList];
  }
}
