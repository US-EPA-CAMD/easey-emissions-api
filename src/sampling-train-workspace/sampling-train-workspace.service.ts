import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { exportSamplingTrainData } from '../sampling-train-functions/export-sampling-train-data';
import { SamplingTrainImportDTO } from '../dto/sampling-train.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class SamplingTrainWorkspaceService {
  constructor(
    private readonly repository: SamplingTrainWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(sorbentTrapId: string) {
    return exportSamplingTrainData({
      sorbentTrapId,
      repository: this.repository,
    });
  }

  async buildObjectList(
    data: SamplingTrainImportDTO[],
    sorbentTrapId: string,
    reportingPeriodId: number,
    monitoringLocationId: string,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        trapId: sorbentTrapId,
        monLocId: monitoringLocationId,
        rptPeriodId: reportingPeriodId,
        componentId: identifiers?.components?.[dataChunk.componentId] || null,
        sorbentTrapSerialNumber: dataChunk.sorbentTrapSN,
        mainTrapHg: dataChunk.mainTrapHg,
        breakthroughTrapHg: dataChunk.btTrapHg,
        spikeTrapHg: dataChunk.spikeTrapHg,
        spikeRefValue: dataChunk.spikeReferenceValue,
        totalSampleValue: dataChunk.totalSampleVolumeDSCM,
        refFlowToSamplingRatio: dataChunk.referenceSFSRRatio,
        hgConcentration: dataChunk.hgConcentration,
        percentBreakthrough: dataChunk.percentBreakthrough,
        percentSpikeRecovery: dataChunk.percentSpikeRecovery,
        samplingRatioTestResultCd: dataChunk.samplingRatioCheckResultCode,
        postLeakTestResultCd: dataChunk.postLeakCheckResultCode,
        trainQAStatusCd: dataChunk.trainQAStatusCode,
        sampleDamageExplanation: dataChunk.sampleDamageExplanation,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.sampling_train',
        [
          'trap_train_id',
          'trap_id',
          'mon_loc_id',
          'rpt_period_id',
          'component_id',
          'sorbent_trap_serial_number',
          'main_trap_hg',
          'breakthrough_trap_hg',
          'spike_trap_hg',
          'spike_ref_value',
          'total_sample_volume',
          'ref_flow_to_sampling_ratio',
          'hg_concentration',
          'percent_breakthrough',
          'percent_spike_recovery',
          'sampling_ratio_test_result_cd',
          'post_leak_test_result_cd',
          'train_qa_status_cd',
          'sample_damage_explanation',
          'userid',
          'add_date',
          'update_date',
        ],
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
