import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';
import { OzoneUnitData } from '../entities/ozone-unit-data.entity';
import { OzoneApportionedEmissionsParamsDTO } from '../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitData)
export class OzoneUnitDataRepository extends Repository<OzoneUnitData> {
  async getOzoneEmissions(
    ozoneApportionedEmissionsParamsDTO: OzoneApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<OzoneUnitData[]> {
    const { page, perPage } = ozoneApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('oud')
      .select([
        'oud.id',
        'oud.year',
        'oud.sumOpTime',
        'oud.countOpTime',
        'oud.grossLoad',
        'oud.steamLoad',
        'oud.heatInput',
        'oud.so2Mass',
        'oud.so2Rate',
        'oud.co2Mass',
        'oud.co2Rate',
        'oud.noxMass',
        'oud.noxRate',
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
      .innerJoin('oud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      ozoneApportionedEmissionsParamsDTO,
      [
        'year',
        'state',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'oud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('oud.year');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
