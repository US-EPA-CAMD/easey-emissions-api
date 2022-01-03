import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';
import { QuarterUnitData } from '../entities/quarter-unit-data.entity';
import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitData)
export class QuarterUnitDataRepository extends Repository<QuarterUnitData> {
  async getQuarterlyEmissions(
    quarterlyApportionedEmissionsParamsDTO: QuarterlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<QuarterUnitData[]> {
    const { page, perPage } = quarterlyApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('qud')
      .select([
        'qud.id',
        'qud.year',
        'qud.quarter',
        'qud.sumOpTime',
        'qud.countOpTime',
        'qud.grossLoad',
        'qud.steamLoad',
        'qud.heatInput',
        'qud.so2Mass',
        'qud.so2Rate',
        'qud.co2Mass',
        'qud.co2Rate',
        'qud.noxMass',
        'qud.noxRate',
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
      .innerJoin('qud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      quarterlyApportionedEmissionsParamsDTO,
      [
        'year',
        'quarter',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'qud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('qud.year')
      .addOrderBy('qud.quarter');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
