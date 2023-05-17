import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { DailyEmissionImportDTO } from '../dto/daily-emission.dto';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DeleteResult, FindConditions } from 'typeorm';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

export type DailyEmissionWorkspaceCreate = DailyEmissionImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyEmissionWorkspaceService {
  constructor(
    private readonly map: DailyEmissionMap,
    private readonly repository: DailyEmissionWorkspaceRepository,
    private readonly dailyFuelWorkspaceService: DailyFuelWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(criteria: FindConditions<DailyEmission>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const dailyEmissionData = await exportDailyEmissionData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    const promises = [];
    if (Array.isArray(dailyEmissionData) && dailyEmissionData.length > 0) {
      for (const dailyEmission of dailyEmissionData) {
        promises.push(
          this.dailyFuelWorkspaceService
            .export([dailyEmission.id])
            .then(dailyFuel => {
              dailyEmission.dailyFuelData = dailyFuel ?? [];
            }),
        );
      }
      await Promise.all(promises);
    }

    return dailyEmissionData;
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.dailyEmissionData) ||
      emissionsImport?.dailyEmissionData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.daily_emission',
      [
        'daily_emission_id',
        'rpt_period_id',
        'mon_loc_id',
        'parameter_cd',
        'begin_date',
        'total_daily_emission',
        'adjusted_daily_emission',
        'sorbent_mass_emission',
        'userid',
        'add_date',
        'update_date',
        'unadjusted_daily_emission',
        'total_carbon_burned',
      ],
    );

    for (const dailyEmissionDatum of emissionsImport.dailyEmissionData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === dailyEmissionDatum.unitId ||
          location.stackPipe?.name === dailyEmissionDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      dailyEmissionDatum['id'] = uid;
      dailyEmissionDatum['locationId'] = monitoringLocationId;

      const {
        parameterCode,
        date,
        totalDailyEmissions,
        adjustedDailyEmissions,
        sorbentRelatedMassEmissions,
        unadjustedDailyEmissions,
        totalCarbonBurned,
      } = dailyEmissionDatum;

      bulkLoadStream.writeObject({
        id: uid,
        reportingPeriodId,
        monitoringLocationId,
        parameterCode,
        date,
        totalDailyEmissions,
        adjustedDailyEmissions,
        sorbentRelatedMassEmissions,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        unadjustedDailyEmissions,
        totalCarbonBurned,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;

    if (bulkLoadStream.status === 'Complete') {
      const buildPromises = [];

      const dailyFuelObjects = [];

      for (const dailyEmissionDatum of emissionsImport.dailyEmissionData) {
        buildPromises.push(
          this.dailyFuelWorkspaceService.buildObjectList(
            dailyEmissionDatum.dailyFuelData,
            dailyEmissionDatum['id'],
            dailyEmissionDatum['locationId'],
            reportingPeriodId,
            identifiers,
            dailyFuelObjects,
            currentTime,
          ),
        );
      }
      await Promise.all(buildPromises);

      await this.dailyFuelWorkspaceService.import(dailyFuelObjects);
    }
  }
}
