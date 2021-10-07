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
        'aud.id',
        'aud.year',
        'aud.sumOpTime',
        'aud.countOpTime',
        'aud.grossLoad',
        'aud.steamLoad',
        'aud.heatInput',
        'aud.so2Mass',
        'aud.so2Rate',
        'aud.co2Mass',
        'aud.co2Rate',
        'aud.noxMass',
        'aud.noxRate',
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
      .innerJoin('aud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      annualApportionedEmissionsParamsDTO,
      [
        'year',
        'state',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'aud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('aud.year');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
