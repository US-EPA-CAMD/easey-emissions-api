import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { exportDailyEmissionData } from '../daily-emission-functions/export-daily-emission-data';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { DailyEmissionImportDTO } from '../dto/daily-emission.dto';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { hasArrayValues } from '../utils/utils';
import { DeleteResult, FindConditions } from 'typeorm';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';

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
  ) {}

  async delete(
    criteria: FindConditions<DailyEmission>,
  ): Promise<DeleteResult> {
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

  async import(data: DailyEmissionWorkspaceCreate) {
   await this.delete({monitoringLocationId: data.monitoringLocationId, reportingPeriodId: data.reportingPeriodId})
    const dailyEmission = await this.repository.save(
      this.repository.create({
        id: randomUUID(),
        reportingPeriodId: data.reportingPeriodId,
        monitoringLocationId: data.monitoringLocationId,
        parameterCode: data.parameterCode,
        date: data.date,
        totalDailyEmissions: data.totalDailyEmissions,
        adjustedDailyEmissions: data.adjustedDailyEmissions,
        sorbentRelatedMassEmissions: data.sorbentRelatedMassEmissions,
        unadjustedDailyEmissions: data.unadjustedDailyEmissions,
        totalCarbonBurned: data.totalCarbonBurned,
        addDate: new Date(),
        updateDate: new Date(),
      }),
    );

    if (hasArrayValues(data.dailyFuelData)) {
      const promises = [];
      for (const dailyFuel of data.dailyFuelData) {
        promises.push(
          this.dailyFuelWorkspaceService
            .import({
              dailyEmissionId: dailyEmission.id,
              monitoringLocationId: data.monitoringLocationId,
              reportingPeriodId: data.reportingPeriodId,
              identifiers: data.identifiers,
              ...dailyFuel,
            })
            .then(data => {
              if (!Array.isArray(dailyEmission.dailyFuelData)) {
                dailyEmission.dailyFuelData = [];
              }

              dailyEmission.dailyFuelData.push(data);
            }),
        );
      }
      await Promise.all(promises);
    }

    return dailyEmission;
  }
}
