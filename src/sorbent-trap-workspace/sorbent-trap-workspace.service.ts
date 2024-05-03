import { Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';

import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { exportSorbentTrapData } from '../sorbent-trap-functions/export-sorbent-trap-data';
import { hasArrayValues } from '../utils/utils';
import { DeleteResult, FindConditions } from 'typeorm';
import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class SorbentTrapWorkspaceService {
  constructor(
    private readonly repository: SorbentTrapWorkspaceRepository,
    private readonly samplingTrainService: SamplingTrainWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(criteria: FindConditions<SorbentTrap>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

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

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.sorbentTrapData) ||
      emissionsImport?.sorbentTrapData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.sorbent_trap',
      [
        'trap_id',
        'mon_loc_id',
        'rpt_period_id',
        'begin_date',
        'begin_hour',
        'end_date',
        'end_hour',
        'mon_sys_id',
        'paired_trap_agreement',
        'absolute_difference_ind',
        'modc_cd',
        'hg_concentration',
        'userid',
        'add_date',
        'update_date',
        'sorbent_trap_aps_cd',
        'rata_ind',
      ],
    );

    for (const sorbentTrapDatum of emissionsImport.sorbentTrapData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === sorbentTrapDatum.unitId ||
          location.stackPipe?.name === sorbentTrapDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      sorbentTrapDatum['id'] = uid;

      bulkLoadStream.writeObject({
        id: uid,
        monLocId: monitoringLocationId,
        rptPeriodId: reportingPeriodId,
        beginDate: sorbentTrapDatum.beginDate,
        beginHour: sorbentTrapDatum.beginHour,
        endDate: sorbentTrapDatum.endDate,
        endHour: sorbentTrapDatum.endHour,
        monSysId:
          identifiers?.locations[monitoringLocationId]?.monitoringSystems?.[
            sorbentTrapDatum.monitoringSystemId
          ] || null,
        pairedTrapAgreement: sorbentTrapDatum.pairedTrapAgreement,
        absoluteDifferentInd: sorbentTrapDatum.absoluteDifferenceIndicator,
        modcCd: sorbentTrapDatum.modcCode,
        hgConcentration: sorbentTrapDatum.hgSystemConcentration,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        sorbentTrapsApsCd: sorbentTrapDatum.apsCode,
        rataInd: sorbentTrapDatum.rataIndicator,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;

    if (bulkLoadStream.status === 'Complete') {
      const buildPromises = [];

      const samplingTrainObjects = [];

      for (const sorbentTrapDatum of emissionsImport.sorbentTrapData) {
        const monitoringLocationId = monitoringLocations.filter(location => {
          return (
            location.unit?.name === sorbentTrapDatum.unitId ||
            location.stackPipe?.name === sorbentTrapDatum.stackPipeId
          );
        })[0].id;
        buildPromises.push(
          this.samplingTrainService.buildObjectList(
            sorbentTrapDatum.samplingTrainData,
            sorbentTrapDatum['id'],
            reportingPeriodId,
            monitoringLocationId,
            identifiers,
            samplingTrainObjects,
            currentTime,
          ),
        );
      }
      await Promise.all(buildPromises);

      await this.samplingTrainService.import(samplingTrainObjects);
    }
  }
}
