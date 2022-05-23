import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
  StreamDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@EntityRepository(DayUnitDataView)
export class DayUnitDataRepository extends Repository<DayUnitDataView> {

  async getQuery(
    columns: any[],
    params: StreamDailyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    return this.buildQuery(columns, params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
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
    params: DailyApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      alias
        ? columns.map(col => `dud.${col.value} AS "${col.value}"`)
        : columns.map(col => `dud.${col.value}`)
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'beginDate',
        'endDate',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'dud',
    );

    query
      .orderBy('dud.facilityId')
      .addOrderBy('dud.unitId')
      .addOrderBy('dud.date');

    return query;
  }
}
