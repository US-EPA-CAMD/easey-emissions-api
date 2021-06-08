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
        'qud.unitId',
        'qud.opYear',
        'qud.opQuarter',
        'qud.sumOpTime',
        'qud.countOpTime',
        'qud.gload',
        'qud.sload',
        'qud.heatInput',
        'qud.so2Mass',
        'qud.so2Rate',
        'qud.co2Mass',
        'qud.co2Rate',
        'qud.noxMass',
        'qud.noxRate',
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
      .innerJoin('qud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      quarterlyApportionedEmissionsParamsDTO,
      [
        'opYear',
        'opQuarter',
        'state',
        'orisCode',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'qud',
      'uf',
    );

    query
      .orderBy('uf.orisCode')
      .addOrderBy('qud.unitId')
      .addOrderBy('qud.opYear')
      .addOrderBy('qud.opQuarter');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
