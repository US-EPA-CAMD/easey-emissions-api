import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO,
  StreamQuarterlyApportionedEmissionsParamsDTO,
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitDataView)
export class QuarterUnitDataRepository extends Repository<QuarterUnitDataView> {
  
  async getQuery(
    columns: any[],
    params: StreamQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    return this.buildQuery(columns, params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let totalCount: number;
    let results: QuarterUnitDataView[];
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
    params: QuarterlyApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<QuarterUnitDataView> {
    let query = this.createQueryBuilder('qud').select(
      alias
        ? columns.map(col => `qud.${col.value} AS "${col.value}"`)
        : columns.map(col => `qud.${col.value}`)
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
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
    );

    query
      .orderBy('qud.facilityId')
      .addOrderBy('qud.unitId')
      .addOrderBy('qud.year')
      .addOrderBy('qud.quarter');

    return query;
  }
}
