import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportSorbentTrapData } from '../sorbent-trap-functions/export-sorbent-trap-data';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { hasArrayValues } from '../utils/utils';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';

@Injectable()
export class SorbentTrapService {
  constructor(
    private readonly repository: SorbentTrapRepository,
    private readonly samplingTrainService: SamplingTrainService,
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
}
