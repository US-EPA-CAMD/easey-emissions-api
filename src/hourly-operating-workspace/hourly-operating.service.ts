import { HttpStatus, Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { randomUUID } from 'crypto';

import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import {
  HourlyOperatingDTO,
  HourlyOperatingImportDTO,
} from '../dto/hourly-operating.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { DeleteCriteria } from '../types';
import { isUndefinedOrNull, splitArrayInChunks } from '../utils/utils';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';

export type HourlyOperatingCreate = HourlyOperatingImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class HourlyOperatingWorkspaceService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingWorkspaceRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueWorkspaceService,
    private readonly derivedHourlyValueService: DerivedHourlyValueWorkspaceService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueWorkspaceService,
    private readonly matsDerivedHourlyValueService: MatsDerivedHourlyValueWorkspaceService,
    private readonly hourlyGasFlowMeterService: HourlyGasFlowMeterWorkspaceService,
    private readonly hourlyFuelFlowService: HourlyFuelFlowWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}
  async getHourlyOpDataByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    const results = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );

    return this.map.many(results);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    if (isUndefinedOrNull(monitoringLocationIds)) {
      return null;
    }

    const hourlyOperating = await this.getHourlyOpDataByLocationIds(
      monitoringLocationIds,
      params,
    );

    let resultPromises = [];

    if (hourlyOperating) {
      const hourlyOperatingDataChunks = splitArrayInChunks(hourlyOperating);

      const getChildrenData = async hourlyOperatingChunk => {
        const hourlyOperatingIds = hourlyOperatingChunk.map(i => i.id);

        if (hourlyOperatingIds?.length > 0) {
          const values = await Promise.all([
            this.monitorHourlyValueService.export(hourlyOperatingIds),
            this.derivedHourlyValueService.export(hourlyOperatingIds),
            this.matsMonitorHourlyValueService.export(hourlyOperatingIds),
            this.matsDerivedHourlyValueService.export(hourlyOperatingIds),
            this.hourlyGasFlowMeterService.export(hourlyOperatingIds),
            this.hourlyFuelFlowService.export(hourlyOperatingIds),
          ]);

          hourlyOperatingChunk?.forEach(hourlyOp => {
            hourlyOp.monitorHourlyValueData =
              values?.[0]?.filter(i => i.hourId === hourlyOp.id) ?? [];
            hourlyOp.derivedHourlyValueData =
              values?.[1]?.filter(derivedHourlyDatum => {
                return derivedHourlyDatum.hourId === hourlyOp.id;
              }) ?? [];
            hourlyOp.matsMonitorHourlyValueData =
              values?.[2]?.filter(i => i.hourId === hourlyOp.id) ?? [];
            hourlyOp.matsDerivedHourlyValueData =
              values?.[3]?.filter(i => i.hourId === hourlyOp.id) ?? [];
            hourlyOp.hourlyGFMData =
              values?.[4]?.filter(i => i.hourId === hourlyOp.id) ?? [];
            hourlyOp.hourlyFuelFlowData =
              values?.[5]?.filter(i => i.hourId === hourlyOp.id) ?? [];
          });
        }
        return hourlyOperatingChunk;
      };

      for (const chunk of hourlyOperatingDataChunks) {
        resultPromises.push(getChildrenData(chunk));
      }
    }
    let results = await Promise.all(resultPromises);

    return results.flat(1);
  }

  async delete(criteria: DeleteCriteria): Promise<void> {
    await this.repository.delete(criteria);
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.hourlyOperatingData) ||
      emissionsImport?.hourlyOperatingData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.hrly_op_data',
    ); // Instantiate our stream object with the correct schema.tableName we want to load to
    for (const hourlyOperatingDatum of emissionsImport.hourlyOperatingData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === hourlyOperatingDatum.unitId ||
          location.stackPipe?.name === hourlyOperatingDatum.stackPipeId
        );
      })[0].id;
      //We must load the parent first because the children records require the parents uid
      const uid = randomUUID();
      hourlyOperatingDatum['id'] = uid; //Set the id on our dto object so we can access it again when loading the children

      bulkLoadStream.writeObject({
        //Write objects in the exact order they appear in the database, or add a column list to the startBulkLoader method and add them in that exact order
        id: uid,
        rptPeriodId: reportingPeriodId,
        monLocId: monitoringLocationId,
        beginDate: hourlyOperatingDatum.date,
        beginHour: hourlyOperatingDatum.hour,
        opTime: hourlyOperatingDatum.operatingTime,
        hrLoad: hourlyOperatingDatum.hourLoad,
        loadRange: hourlyOperatingDatum.loadRange,
        commonStackLoadRange: hourlyOperatingDatum.commonStackLoadRange,
        fcFactor: hourlyOperatingDatum.fcFactor,
        fdFactor: hourlyOperatingDatum.fdFactor,
        fwFactor: hourlyOperatingDatum.fwFactor,
        fuelCd: hourlyOperatingDatum.fuelCode,
        multiFuelFlag: null,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        loadUOM: hourlyOperatingDatum.loadUnitsOfMeasureCode,
        operatingConditionCd: null,
        fuelCdList: null,
        mhhiInd: null,
        matsLoad: hourlyOperatingDatum.matsHourLoad,
        shutdownFlaf: hourlyOperatingDatum.matsStartupShutdownFlag,
      });
    }

    bulkLoadStream.complete(); // Call this method to complete writing to the stream and execute the data load
    await bulkLoadStream.finished; // Await data load completion

    if (bulkLoadStream.status === 'Complete') {
      //Make sure we did not error in the data loading phase of the parent
      const buildPromises = [];

      //Define our objects that are built up and then bulk loaded
      const derivedHourlyValueObjects = [];
      const matsMonitorHourlyValueObjects = [];
      const monitorHourlyValueObjects = [];
      const matsDerivedHourlyValueObjects = [];
      const hourlyFuelFlowObjects = [];
      const hourlyParameterFuelFlowObjects = [];
      const hourlyGasFlowMeterObjects = [];

      for (const hourlyOperatingDatum of emissionsImport.hourlyOperatingData) {
        const monitoringLocationId = monitoringLocations.filter(location => {
          return (
            location.unit?.name === hourlyOperatingDatum.unitId ||
            location.stackPipe?.name === hourlyOperatingDatum.stackPipeId
          );
        })[0].id;

        //Load children records in a bulk fashion as well
        buildPromises.push(
          this.derivedHourlyValueService.buildObjectList(
            hourlyOperatingDatum.derivedHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            derivedHourlyValueObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.matsMonitorHourlyValueService.buildObjectList(
            hourlyOperatingDatum.matsMonitorHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            matsMonitorHourlyValueObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.monitorHourlyValueService.buildObjectList(
            hourlyOperatingDatum.monitorHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            monitorHourlyValueObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.matsDerivedHourlyValueService.buildObjectList(
            hourlyOperatingDatum.matsDerivedHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            matsDerivedHourlyValueObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.hourlyFuelFlowService.buildObjectList(
            hourlyOperatingDatum.hourlyFuelFlowData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            hourlyFuelFlowObjects,
            hourlyParameterFuelFlowObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.hourlyGasFlowMeterService.buildObjectList(
            hourlyOperatingDatum.hourlyGFMData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            hourlyGasFlowMeterObjects,
            currentTime,
          ),
        );
      }

      await Promise.all(buildPromises);

      //Write logic to insert the children records into the database in proper order
      const insertPromises = [];
      insertPromises.push(
        this.derivedHourlyValueService.import(derivedHourlyValueObjects),
      );
      insertPromises.push(
        this.matsMonitorHourlyValueService.import(
          matsMonitorHourlyValueObjects,
        ),
      );
      insertPromises.push(
        this.monitorHourlyValueService.import(monitorHourlyValueObjects),
      );
      insertPromises.push(
        this.matsDerivedHourlyValueService.import(
          matsDerivedHourlyValueObjects,
        ),
      );
      insertPromises.push(
        this.hourlyFuelFlowService.import(
          hourlyFuelFlowObjects,
          hourlyParameterFuelFlowObjects,
        ),
      );
      insertPromises.push(
        this.hourlyGasFlowMeterService.import(hourlyGasFlowMeterObjects),
      );

      const settled = await Promise.allSettled(insertPromises);

      for (const settledElement of settled) {
        if (settledElement.status === 'rejected') {
          throw new EaseyException(
            new Error(settledElement.reason),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }
}
