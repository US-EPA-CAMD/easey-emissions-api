import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
  StreamMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@EntityRepository(MonthUnitDataView)
export class MonthUnitDataRepository extends Repository<MonthUnitDataView> {
  
  async getQuery(
    columns: any[],
    params: StreamMonthlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    return this.buildQuery(columns, params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
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
    params: MonthlyApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      alias
        ? columns.map(col => `mud.${col.value} AS "${col.value}"`)
        : columns.map(col => `mud.${col.value}`)
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'month',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'mud',
    );

    query
      .orderBy('mud.facilityId')
      .addOrderBy('mud.unitId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query;
  }
}
