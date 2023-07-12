import { Injectable } from "@nestjs/common";
import { ImportIdentifiers } from "../emissions-workspace/emissions.service";
import { BulkLoadService } from "@us-epa-camd/easey-common/bulk-load";
import { EmissionsImportDTO } from "../dto/emissions.dto";

export type DailyBackstopCreate = & {
    reportingPeriodId: number;
    monitoringLocationId: string;
    identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyBackstopWorkspaceService {

    constructor(
        private readonly bulkLoadService: BulkLoadService,    
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
          const monitoringLocationId = monitoringLocations.filter(location => 
              location.unit?.name === dailyBackstopDatum.unitId 
          )[0].id;
        
          const {
            date,
            dailyNOxEmissions,
            dailyHeatInput,
            dailyAverageNOxRate,
            dailyNOxExceedence,
            cumulativeOSNOxExceedence,
          } = dailyBackstopDatum;
    
          bulkLoadStream.writeObject({
            date,
            dailyNOxEmissions,
            dailyHeatInput,
            dailyAverageNOxRate,
            dailyNOxExceedence,
            cumulativeOSNOxExceedence,
            monitoringLocationId,
            reportingPeriodId,
            userId: identifiers?.userId,
            addDate: currentTime,
            updateDate: currentTime,
          });
        }
    
        bulkLoadStream.complete();
        await bulkLoadStream.finished;
      }
}
