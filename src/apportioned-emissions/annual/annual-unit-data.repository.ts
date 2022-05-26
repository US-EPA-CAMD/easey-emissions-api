import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';

import {
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
  StreamAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitDataView)
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {
  
  async getQuery(
    columns: any[],
    params: StreamAnnualApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    return this.buildQuery(columns, params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
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

  buildQuery(
    columns: any[],
    params: AnnualApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<AnnualUnitDataView> {
    let query = this.createQueryBuilder('aud').select(
      alias
        ? columns.map(col => `aud.${col.value} AS "${col.value}"`)
        : columns.map(col => `aud.${col.value}`)
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
      'aud',
    );

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query;
  }
}
