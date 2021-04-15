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
        'dud.unitId',
        'dud.opDate',
        'dud.sumOpTime',
        'dud.countOpTime',
        'dud.gload',
        'dud.sload',
        'dud.heatInput',
        'dud.so2Mass',
        'dud.so2Rate',
        'dud.co2Mass',
        'dud.co2Rate',
        'dud.noxMass',
        'dud.noxRate',
        'uf.state',
        'uf.facilityName',
        'uf.orisCode',
        'uf.unitid',
        'uf.primaryFuelInfo',
        'uf.secondaryFuelInfo',
        'uf.unitTypeInfo',
        'uf.so2ControlInfo',
        'uf.partControlInfo',
        'uf.noxControlInfo',
        'uf.hgControlInfo',
        'uf.prgCodeInfo',
        'uf.assocStacks',
      ])
      .innerJoin('dud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      dailyApportionedEmissionsParamsDTO,
      [
        'beginDate',
        'endDate',
        'state',
        'orisCode',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'dud',
      'uf',
    );

    query
      .orderBy('uf.orisCode')
      .addOrderBy('dud.unitId')
      .addOrderBy('dud.opDate');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
