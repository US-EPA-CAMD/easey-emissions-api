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
        'mud.id',
        'mud.year',
        'mud.month',
        'mud.sumOpTime',
        'mud.countOpTime',
        'mud.grossLoad',
        'mud.steamLoad',
        'mud.heatInput',
        'mud.so2Mass',
        'mud.so2Rate',
        'mud.co2Mass',
        'mud.co2Rate',
        'mud.noxMass',
        'mud.noxRate',
        'uf.state',
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
      .innerJoin('mud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      monthlyApportionedEmissionsParamsDTO,
      [
        'year',
        'month',
        'state',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'mud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
