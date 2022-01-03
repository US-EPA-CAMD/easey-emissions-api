import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { DayUnitData } from '../entities/day-unit-data.entity';
import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';

@EntityRepository(DayUnitData)
export class DayUnitDataRepository extends Repository<DayUnitData> {
  async getDailyEmissions(
    dailyApportionedEmissionsParamsDTO: DailyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<DayUnitData[]> {
    const { page, perPage } = dailyApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('dud')
      .select([
        'dud.id',
        'dud.date',
        'dud.sumOpTime',
        'dud.countOpTime',
        'dud.grossLoad',
        'dud.steamLoad',
        'dud.heatInput',
        'dud.so2Mass',
        'dud.so2Rate',
        'dud.co2Mass',
        'dud.co2Rate',
        'dud.noxMass',
        'dud.noxRate',
        'uf.stateCode',
        'uf.facilityName',
        'uf.facilityId',
        'uf.unitId',
        'uf.primaryFuelInfo',
        'uf.secondaryFuelInfo',
        'uf.unitType',
        'uf.so2ControlInfo',
        'uf.pmControlInfo',
        'uf.noxControlInfo',
        'uf.hgControlInfo',
        'uf.programCodeInfo',
        'uf.associatedStacks',
      ])
      .innerJoin('dud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      dailyApportionedEmissionsParamsDTO,
      [
        'beginDate',
        'endDate',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'dud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('dud.date');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
