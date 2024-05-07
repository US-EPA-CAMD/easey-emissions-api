import { HttpStatus, Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { randomUUID } from 'crypto';
import { DeleteResult } from 'typeorm';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { exportNsps4tSummaryData } from '../nsps4t-summary-functions/export-nsps4t-summary-data';
import { DeleteCriteria } from '../types';
import { arrayPushCreate, hasArrayValues } from '../utils/utils';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';

@Injectable()
export class Nsps4tSummaryWorkspaceService {
  constructor(
    private readonly repository: Nsps4tSummaryWorkspaceRepository,
    private readonly nsps4tAnnualService: Nsps4tAnnualWorkspaceService,
    private readonly nsps4tCompliancePeriodService: Nsps4tCompliancePeriodWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(criteria: DeleteCriteria): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO) {
    const nsps4tSummaryData = await exportNsps4tSummaryData({
      monitoringLocationIds,
      year: params.year,
      quarter: params.quarter,
      repository: this.repository,
    });

    if (hasArrayValues(nsps4tSummaryData)) {
      const promises = [];
      for (const nsps4tSummary of nsps4tSummaryData) {
        promises.push(
          this.nsps4tAnnualService.export([nsps4tSummary.id]).then(data => {
            nsps4tSummary.nsps4tFourthQuarterData =
              arrayPushCreate(nsps4tSummary.nsps4tFourthQuarterData, data) ??
              [];
          }),
          this.nsps4tCompliancePeriodService
            .export([nsps4tSummary.id])
            .then(data => {
              nsps4tSummary.nsps4tCompliancePeriodData =
                arrayPushCreate(
                  nsps4tSummary.nsps4tCompliancePeriodData,
                  data,
                ) ?? [];
            }),
        );
      }
      await Promise.all(promises);
    }
    return nsps4tSummaryData;
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.nsps4tSummaryData) ||
      emissionsImport?.nsps4tSummaryData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.nsps4t_summary',
      [
        'nsps4t_sum_id',
        'emission_standard_cd',
        'modus_value',
        'modus_uom_cd',
        'electrical_load_cd',
        'no_period_ended_ind',
        'no_period_ended_comment',
        'mon_loc_id',
        'rpt_period_id',
        'userid',
        'add_date',
        'update_date',
      ],
    );

    for (const nsps4tSummaryDatum of emissionsImport.nsps4tSummaryData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === nsps4tSummaryDatum.unitId ||
          location.stackPipe?.name === nsps4tSummaryDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      nsps4tSummaryDatum['id'] = uid;

      bulkLoadStream.writeObject({
        id: uid,
        emissionStandardCd: nsps4tSummaryDatum.co2EmissionStandardCode,
        modusValue: nsps4tSummaryDatum.modusValue,
        modusUomCd: nsps4tSummaryDatum.modusUnitsOfMeasureCode,
        electricalLoadCd: nsps4tSummaryDatum.electricalLoadCode,
        noPeriodEndedInd: nsps4tSummaryDatum.noCompliancePeriodEndedIndicator,
        noPeriodEndedComment: nsps4tSummaryDatum.noCompliancePeriodEndedComment,
        monLocId: monitoringLocationId,
        rptPeriodId: reportingPeriodId,
        userid: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;

    if (bulkLoadStream.status === 'Complete') {
      const buildPromises = [];

      const nsps4tAnnualObjects = [];
      const nsps4tCompliancePeriodObjects = [];

      for (const nsps4tSummaryDatum of emissionsImport.nsps4tSummaryData) {
        const monitoringLocationId = monitoringLocations.filter(location => {
          return (
            location.unit?.name === nsps4tSummaryDatum.unitId ||
            location.stackPipe?.name === nsps4tSummaryDatum.stackPipeId
          );
        })[0].id;

        buildPromises.push(
          this.nsps4tAnnualService.buildObjectList(
            nsps4tSummaryDatum.nsps4tFourthQuarterData,
            nsps4tSummaryDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            nsps4tAnnualObjects,
            currentTime,
          ),
        );

        buildPromises.push(
          this.nsps4tCompliancePeriodService.buildObjectList(
            nsps4tSummaryDatum.nsps4tCompliancePeriodData,
            nsps4tSummaryDatum['id'],
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
            nsps4tCompliancePeriodObjects,
            currentTime,
          ),
        );
      }

      await Promise.all(buildPromises);

      const insertPromises = [];
      insertPromises.push(this.nsps4tAnnualService.import(nsps4tAnnualObjects));
      insertPromises.push(
        this.nsps4tCompliancePeriodService.import(
          nsps4tCompliancePeriodObjects,
        ),
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
