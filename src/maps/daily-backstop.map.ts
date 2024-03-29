import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { DailyBackstop } from '../entities/daily-backstop.entity';
import { DailyBackstop as DailyBackstopWorkspace } from '../entities/workspace/daily-backstop.entity';
import { DailyBackstopDTO } from '../dto/daily-backstop.dto';


@Injectable()
export class DailyBackstopMap extends BaseMap<
    DailyBackstop | DailyBackstopWorkspace,
    DailyBackstopDTO
> {
    public async one(
        entity: DailyBackstop | DailyBackstopWorkspace,
    ): Promise<DailyBackstopDTO> {
        const unitId = entity?.monitorLocation?.unit?.name ?? null;

        return {
            id: entity.id,
            unitId,
            monitoringLocationId: entity.monitoringLocationId,
            userId: entity.userId,
            addDate: entity.addDate?.toISOString() ?? null,
            updateDate: entity.updateDate?.toISOString() ?? null,
            reportingPeriodId: entity.reportingPeriodId,
            date: entity.date,
            dailyNoxEmissions: entity.dailyNoxEmissions,
            dailyHeatInput: entity.dailyHeatInput,
            dailyAverageNoxRate: entity.dailyAverageNoxRate,
            dailyNoxExceedence: entity.dailyNoxExceedence,
            cumulativeOsNoxExceedence: entity.cumulativeOsNoxExceedence,
        };
    }
}
