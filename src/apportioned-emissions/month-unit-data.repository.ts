import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { MonthUnitData } from '../entities/month-unit-data.entity';
import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';

@EntityRepository(MonthUnitData)
export class MonthUnitDataRepository extends Repository<MonthUnitData> {
  async getMonthlyEmissions(
    monthlyApportionedEmissionsParamsDTO: MonthlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<MonthUnitData[]> {
    const { page, perPage } = monthlyApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('mud')
      .select([
        'mud.unitId',
        'mud.opYear',
        'mud.opMonth',
        'mud.sumOpTime',
        'mud.countOpTime',
        'mud.gload',
        'mud.sload',
        'mud.heatInput',
        'mud.so2Mass',
        'mud.so2Rate',
        'mud.co2Mass',
        'mud.co2Rate',
        'mud.noxMass',
        'mud.noxRate',
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
      .innerJoin('mud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      monthlyApportionedEmissionsParamsDTO,
      [
        'opYear',
        'opMonth',
        'state',
        'orisCode',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'mud',
      'uf',
    );

    query
      .orderBy('uf.orisCode')
      .addOrderBy('mud.unitId')
      .addOrderBy('mud.opYear')
      .addOrderBy('mud.opMonth');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
