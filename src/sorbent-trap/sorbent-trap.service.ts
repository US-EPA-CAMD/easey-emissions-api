import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportSorbentTrapData } from '../sorbent-trap-functions/export-sorbent-trap-data';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { hasArrayValues } from '../utils/utils';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SorbentTrapDTO } from 'src/dto/sorbent-trap.dto';

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
            sorbentTrap.samplingTrainData = data ?? [];
          }),
        );
      }
      await Promise.all(promises);
    }

    return sorbentTrapData;
  }

  async removeNonReportedValues(sorbentTrapData: SorbentTrapDTO[]) {
    const promises = [];
    sorbentTrapData.forEach(dto => {
      promises.push(this.samplingTrainService.removeNonReportedValues(dto.samplingTrainData));
      delete dto.id;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.monitoringSystemRecordId;
      delete dto.calcPairedTrapAgreement;
      delete dto.calcModcCode;
      delete dto.calcHgConcentration;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    });

    await Promise.all(promises);
  }
}
