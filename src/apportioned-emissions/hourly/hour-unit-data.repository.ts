import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
  StreamHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitDataView)
export class HourUnitDataRepository extends Repository<HourUnitDataView> {

  async getQuery(
    columns: any[],
    params: StreamHourlyApportionedEmissionsParamsDTO,
  ): Promise<[string, any[]]> {
    return this.buildQuery(columns, params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let totalCount: number;
    let results: HourUnitDataView[];
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
    params: HourlyApportionedEmissionsParamsDTO,
    alias: boolean = false
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      alias
        ? columns.map(col => `hud.${col.value} AS "${col.value}"`)
        : columns.map(col => `hud.${col.value}`)
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
        'operatingHoursOnly',
      ],
      'hud',
    );

    query
      .orderBy('hud.facilityId')
      .addOrderBy('hud.unitId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }
}
