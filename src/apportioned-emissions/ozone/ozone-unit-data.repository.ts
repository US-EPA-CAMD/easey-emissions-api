import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitDataView)
export class OzoneUnitDataRepository extends Repository<OzoneUnitDataView> {
  
  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(columns, params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    } else {
      results = await query.getMany();
    }

    return results;
  }

  private buildQuery(
    columns: any[],
    params: OzoneApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<OzoneUnitDataView> {
    let query = this.createQueryBuilder('oud').select(
      alias
        ? columns.map(col => `oud.${col.value} AS "${col.value}"`)
        : columns.map(col => `oud.${col.value}`)
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'oud',
    );

    query
      .orderBy('oud.facilityId')
      .addOrderBy('oud.unitId')
      .addOrderBy('oud.year');

    return query;
  }
}
