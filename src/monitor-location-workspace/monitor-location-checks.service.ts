import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from 'src/dto/emissions.dto';
import { LocationIdentifiers } from 'src/interfaces/location-identifiers.interface';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly repository: MonitorLocationWorkspaceRepository,
  ) {}

  processLocations(payload: EmissionsImportDTO): LocationIdentifiers[] {
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: any) => {
      const systemIDs = [];
      const componentIDs = [];

      const location = locations.find(
        l => l?.unitId === i?.unitId || l?.stackPipeId === i?.stackPipeId,
      );

      if (location) {
        if (
          i.monitoringSystemID &&
          !location.systemIDs.includes(i.monitoringSystemID)
        ) {
          location.systemIDs.push(i.monitoringSystemID);
        }
        if (i.componentID && !location.componentIDs.includes(i.componentID)) {
          location.componentIDs.push(i.componentID);
        }
      } else {
        if (i.monitoringSystemID) {
          systemIDs.push(i.monitoringSystemID);
        }
        if (i.componentID) {
          componentIDs.push(i.componentID);
        }

        locations.push({
          unitId: i.unitId,
          locationId: null,
          stackPipeId: i.stackPipeId,
          systemIDs,
          componentIDs,
        });
      }
    };

    if (payload.dailyEmissionData) {
      payload.dailyEmissionData.forEach(i => addLocation(i));
    }

    if (payload.weeklyTestSummaryData) {
      payload.weeklyTestSummaryData.forEach(i => addLocation(i));
    }

    if (payload.summaryValueData) {
      payload.summaryValueData.forEach(i => addLocation(i));
    }

    if (payload.hourlyOperatingData) {
      payload.hourlyOperatingData.forEach(i => addLocation(i));
    }

    if (payload.longTermFuelFlowData) {
      payload.longTermFuelFlowData.forEach(i => addLocation(i));
    }

    if (payload.sorbentTrapData) {
      payload.sorbentTrapData.forEach(i => addLocation(i));
    }


    return locations;
  }

  async runChecks(
    payload: QACertificationImportDTO,
  ): Promise<[LocationIdentifiers[], string[]]> {
    this.logger.info('Running Unit/Stack Location Checks');

    let errorList = [];
    const stackPipePrefixes = ['CS', 'MS', 'CP', 'MP'];
    const orisCode = payload.orisCode;

    const locations: LocationIdentifiers[] = this.processLocations(payload);

    if (locations.length === 0) {
      // IMPORT-13 (Result A)
      errorList.push(
        'There are no test summary, certifications events, or extension/exmeption records present in the file to be imported',
      );
    }

    const dbLocations = await this.repository.getLocationsByUnitStackPipeIds(
      orisCode,
      locations.filter(i => i.unitId !== null).map(i => i.unitId),
      locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
    );

    locations.forEach(location => {
      let unitStack = '';
      const dbLocation = dbLocations.find(
        i =>
          i?.unit?.name === location?.unitId ||
          i?.stackPipe?.name === location?.stackPipeId,
      );

      if (location.unitId) {
        unitStack = `Unit [${location.unitId}]`;

        if (
          location.unitId.length >= 2 &&
          stackPipePrefixes.includes(location.unitId.substring(0, 2))
        ) {
          // IMPORT-13 All Unit Locations Present in the Production Database (Result C)
          errorList.push(
            `The following Stack/Pipe was misidentified as a unit [${location.unitId}]`,
          );
        } else if (!dbLocation) {
          // IMPORT-13 All Stack/Pipe Locations Present in the Production Database (Result B)
          errorList.push(
            `The database does not contain Unit [${location.unitId}] for Facility [${orisCode}]`,
          );
        }
      }

      if (location.stackPipeId) {
        unitStack = `Stack/Pipe [${location.stackPipeId}]`;

        if (!dbLocation) {
          // IMPORT-13 All Stack/Pipe Locations Present in the Production Database (Result B)
          errorList.push(
            `The database does not contain Stack/Pipe [${location.stackPipeId}] for Facility [${orisCode}]`,
          );
        }
      }

      if (dbLocation) {
        location.locationId = dbLocation.id;
        const dbSystemIDs = dbLocation.systems.map(i => i.monitoringSystemID);
        const dbComponentIDs = dbLocation.components.map(i => i.componentID);

        location.systemIDs.forEach(systemId => {
          if (!dbSystemIDs.includes(systemId)) {
            // IMPORT-14 All QA Systems Present in the Production Database (Result A)
            errorList.push(
              `The database does not contain System [${systemId}] for ${unitStack} and Facility [${orisCode}]`,
            );
          }
        });

        location.componentIDs.forEach(componentID => {
          if (!dbComponentIDs.includes(componentID)) {
            // IMPORT-15 All QA Components Present in the Production Database (Result A)
            errorList.push(
              `The database does not contain Component [${componentID}] for ${unitStack} and Facility [${orisCode}]`,
            );
          }
        });
      }
    });

    this.logger.info('Completed Unit/Stack Location Checks');
    return [locations, errorList];
  }
}
