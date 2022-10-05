import { Injectable } from '@nestjs/common';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportSorbentTrapData } from '../sorbent-trap-functions/export-sorbent-trap-data';
import { hasArrayValues } from '../utils/utils';
import {
  importSorbentTrapData,
  SorbentTrapWorkspaceCreate,
} from '../sorbent-trap-functions/import-sorbent-trap-data';

@Injectable()
export class SorbentTrapWorkspaceService {
  constructor(
    private readonly repository: SorbentTrapWorkspaceRepository,
    private readonly samplingTrainService: SamplingTrainWorkspaceService,
  ) {}

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const sorbentTrapData = await exportSorbentTrapData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    if (hasArrayValues(sorbentTrapData)) {
      const promises = [];
      for (const sorbentTrap of sorbentTrapData) {
        promises.push(
          this.samplingTrainService.export(sorbentTrap.id).then(data => {
            sorbentTrap.samplingTrainData = data;
          }),
        );
      }
      await Promise.all(promises);
    }

    return sorbentTrapData;
  }

  async import(data: SorbentTrapWorkspaceCreate) {
    const sorbentTrap = await importSorbentTrapData({
      data,
      repository: this.repository,
    });

    if (hasArrayValues(data.samplingTrainData)) {
      const promises = [];
      for (const samplingTrain of data.samplingTrainData) {
        await this.samplingTrainService
          .import({
            ...samplingTrain,
            sorbentTrapId: sorbentTrap.id,
            monitoringLocationId: data.monitoringLocationId,
            reportingPeriodId: data.reportingPeriodId,
            identifiers: data.identifiers,
          })
          .then(data => {
            if (!Array.isArray(sorbentTrap.samplingTrains)) {
              sorbentTrap.samplingTrains = [];
            }

            sorbentTrap.samplingTrains.push(data);
          });
      }
      await Promise.all(promises);
    }

    return sorbentTrap;
  }
}
