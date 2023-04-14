import { HttpStatus, Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { randomUUID } from 'crypto';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import {
  HourlyOperatingDTO,
  HourlyOperatingImportDTO,
} from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { isUndefinedOrNull } from '../utils/utils';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

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

    if (hourlyOperating) {
      const hourlyOperatingIds = hourlyOperating.map(i => i.id);
      if (hourlyOperatingIds?.length > 0) {
        const values = await Promise.all([
          this.monitorHourlyValueService.export(hourlyOperatingIds),
          this.derivedHourlyValueService.export(hourlyOperatingIds),
          this.matsMonitorHourlyValueService.export(hourlyOperatingIds),
          this.matsDerivedHourlyValueService.export(hourlyOperatingIds),
          this.hourlyGasFlowMeterService.export(hourlyOperatingIds),
          this.hourlyFuelFlowService.export(hourlyOperatingIds),
        ]);

        hourlyOperating?.forEach(hourlyOp => {
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
    }

    return hourlyOperating;
  }

  async delete(criteria: FindConditions<HrlyOpData>): Promise<void> {
    await this.repository.delete(criteria);
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
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
        addDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
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
      const promises = [];

      for (const hourlyOperatingDatum of emissionsImport.hourlyOperatingData) {
        //Load children records in a bulk fashion as well
        promises.push(
          this.derivedHourlyValueService.import(
            hourlyOperatingDatum.derivedHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );

        promises.push(
          this.matsMonitorHourlyValueService.import(
            hourlyOperatingDatum.matsMonitorHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );

        promises.push(
          this.monitorHourlyValueService.import(
            hourlyOperatingDatum.monitorHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );

        promises.push(
          this.matsDerivedHourlyValueService.import(
            hourlyOperatingDatum.matsDerivedHourlyValueData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );

        promises.push(
          this.hourlyFuelFlowService.import(
            hourlyOperatingDatum.hourlyFuelFlowData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );

        promises.push(
          this.hourlyGasFlowMeterService.import(
            hourlyOperatingDatum.hourlyGFMData,
            hourlyOperatingDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          ),
        );
      }

      const settled = await Promise.allSettled(promises);

      for (const settledElement of settled) {
        if (settledElement.status === 'rejected') {
          throw new LoggingException(
            settledElement.reason.detail,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    console.log('All hourly op data imported successfully');
  }
}
