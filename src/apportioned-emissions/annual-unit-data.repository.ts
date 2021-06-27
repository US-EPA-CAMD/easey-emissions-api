import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';
import { AnnualUnitData } from '../entities/annual-unit-data.entity';
import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitData)
export class AnnualUnitDataRepository extends Repository<AnnualUnitData> {
  async getAnnualEmissions(
    annualApportionedEmissionsParamsDTO: AnnualApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<AnnualUnitData[]> {
    const { page, perPage } = annualApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('aud')
      .select([
        'aud.unitId',
        'aud.opYear',
        'aud.sumOpTime',
        'aud.countOpTime',
        'aud.gload',
        'aud.sload',
        'aud.heatInput',
        'aud.so2Mass',
        'aud.so2Rate',
        'aud.co2Mass',
        'aud.co2Rate',
        'aud.noxMass',
        'aud.noxRate',
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
      .innerJoin('aud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      annualApportionedEmissionsParamsDTO,
      [
        'opYear',
        'state',
        'orisCode',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'aud',
      'uf',
    );

    query
      .orderBy('uf.orisCode')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.opYear');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
