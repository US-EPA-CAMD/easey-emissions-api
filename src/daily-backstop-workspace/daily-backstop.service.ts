import { Injectable } from "@nestjs/common";
import { ImportIdentifiers } from "../emissions-workspace/emissions.service";
import { BulkLoadService } from "@us-epa-camd/easey-common/bulk-load";
import { EmissionsImportDTO } from "../dto/emissions.dto";
import { MonitorLocation } from "../entities/workspace/monitor-location.entity";
import { DailyBackstopWorkspaceRepository} from "./daily-backstop.repository";
import { DailyBackstopMap} from "../maps/daily-backstop.map";
import {DailyBackstopDTO} from "../dto/daily-backstop.dto";
import {EmissionsParamsDTO} from "../dto/emissions.params.dto";

export type DailyBackstopCreate = & {
    reportingPeriodId: number;
    monitoringLocationId: string;
    identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyBackstopWorkspaceService {

    constructor(
        private readonly bulkLoadService: BulkLoadService,
        private readonly repository: DailyBackstopWorkspaceRepository,
        private readonly map: DailyBackstopMap,
    ){}

    async import(
        emissionsImport: EmissionsImportDTO,
        monitoringLocations,
        reportingPeriodId,
        identifiers: ImportIdentifiers,
        currentTime: string,
      ): Promise<void> {
        if (
          !Array.isArray(emissionsImport?.dailyBackstopData) ||
          emissionsImport?.dailyBackstopData.length === 0
        ) {
          return;
        }
    
        const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
          'camdecmpswks.daily_backstop',
          [
            'unit_id',
            'op_date',
            'daily_noxm',
            'daily_hit',
            'daily_avg_noxr',
            'daily_noxm_exceed',
            'cumulative_os_noxm_exceed',
            'mon_loc_id',
            'rpt_period_id',
            'userid',
            'add_date',
            'update_date',
          ],
        );
    
        for (const dailyBackstopDatum of emissionsImport.dailyBackstopData) {
          const monitoringLocation: MonitorLocation = monitoringLocations.filter(location => 
              location.unit?.name === dailyBackstopDatum.unitId 
          )[0];
        
          const {
            date,
            dailyNOxEmissions,
            dailyHeatInput,
            dailyAverageNOxRate,
            dailyNOxExceedence,
            cumulativeOSNOxExceedence,
          } = dailyBackstopDatum;
    
          bulkLoadStream.writeObject({
            unitId: monitoringLocation?.unit?.id ?? null,
            date,
            dailyNOxEmissions,
            dailyHeatInput,
            dailyAverageNOxRate,
            dailyNOxExceedence,
            cumulativeOSNOxExceedence,
            monitoringLocationId: monitoringLocation?.id ?? null,
            reportingPeriodId,
            userId: identifiers?.userId,
            addDate: currentTime,
            updateDate: currentTime,
          });
        }
    
        bulkLoadStream.complete();
        await bulkLoadStream.finished;
      }

    async export(monitoringLocationIds: string[], params: EmissionsParamsDTO): Promise<DailyBackstopDTO[]> {
        const results = await this.repository
            .createQueryBuilder('backstop')
            .innerJoinAndSelect('backstop.monitorLocation', 'monitorLocation')
            .leftJoinAndSelect('monitorLocation.unit', 'unit')
            .leftJoinAndSelect('monitorLocation.stackPipe', 'stack')
            .innerJoin('backstop.reportingPeriod', 'reportingPeriod')
            .where('monitorLocation.mon_loc_id IN (:...monitoringLocationIds)', {
                monitoringLocationIds: monitoringLocationIds,
            })
            .andWhere('reportingPeriod.year = :year', { year: params.year })
            .andWhere('reportingPeriod.quarter = :quarter', { quarter: params.quarter })
            .getMany();

        if (!results) {
            return null;
        }

        return this.map.many(results);
    }
}
