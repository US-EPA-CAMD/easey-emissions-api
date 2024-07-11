import { Injectable } from "@nestjs/common";
import {DailyBackstopDTO} from "../dto/daily-backstop.dto";
import { DailyBackstopRepository} from "./daily-backstop.repository";
import { DailyBackstopMap } from "../maps/daily-backstop.map";
import {EmissionsParamsDTO} from "../dto/emissions.params.dto";

@Injectable()
export class DailyBackstopService {
    constructor(
        private readonly repository: DailyBackstopRepository,
        private readonly map: DailyBackstopMap,
    ){}

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
            .orderBy({
                'backstop.date': 'ASC',
            })
            .getMany();

        if (!results) {
            return null;
        }

        return this.map.many(results);
    }
}
