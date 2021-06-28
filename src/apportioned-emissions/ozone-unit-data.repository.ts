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
        'oud.unitId',
        'oud.opYear',
        'oud.sumOpTime',
        'oud.countOpTime',
        'oud.gload',
        'oud.sload',
        'oud.heatInput',
        'oud.so2Mass',
        'oud.so2Rate',
        'oud.co2Mass',
        'oud.co2Rate',
        'oud.noxMass',
        'oud.noxRate',
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
      .innerJoin('oud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      ozoneApportionedEmissionsParamsDTO,
      [
        'opYear',
        'state',
        'orisCode',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
      ],
      'oud',
      'uf',
    );

    query
      .orderBy('uf.orisCode')
      .addOrderBy('oud.unitId')
      .addOrderBy('oud.opYear');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
