import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';
import { DayUnitData } from '../entities/day-unit-data.entity';
import { ApportionedEmissionsParamsDTO } from '../dto/apportioned-emissions.params.dto';

@EntityRepository(DayUnitData)
export class DayUnitDataRepository extends Repository<DayUnitData> {
  async getDailyEmissions(
    apportionedEmissionsParamsDTO: ApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<DayUnitData[]> {
    const { page, perPage } = apportionedEmissionsParamsDTO;

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
      apportionedEmissionsParamsDTO,
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
