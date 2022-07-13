import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@EntityRepository(MonthUnitDataView)
export class MonthUnitDataRepository extends Repository<MonthUnitDataView> {
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

  private buildQuery(
    columns: any[],
    params: MonthlyApportionedEmissionsParamsDTO,
    alias: boolean = false,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      alias
        ? columns.map((col) => `mud.${col.value} AS "${col.value}"`)
        : columns.map((col) => `mud.${col.value}`),
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

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = [
      'mud.stateCode',
      'mud.facilityName',
      'mud.facilityId',
      'mud.year',
      'mud.month',
    ];
    const orderByColumns = ['mud.facilityId', 'mud.year', 'mud.month'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    results = await query.getRawMany();
    if (results && results.length > 0) {
      const countQuery = this.buildAggregationQuery(
        params,
        selectColumns,
        orderByColumns,
        true,
      );
      totalCount = (await countQuery.getRawOne()).count;
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['mud.stateCode', 'mud.year', 'mud.month'];
    const orderByColumns = ['mud.stateCode', 'mud.year', 'mud.month'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    results = await query.getRawMany();
    if (results && results.length > 0) {
      const countQuery = this.buildAggregationQuery(
        params,
        selectColumns,
        orderByColumns,
        true,
      );
      totalCount = (await countQuery.getRawOne()).count;
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['mud.year', 'mud.month'];
    const orderByColumns = ['mud.year', 'mud.month'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    results = await query.getRawMany();
    if (results && results.length > 0) {
      const countQuery = this.buildAggregationQuery(
        params,
        selectColumns,
        orderByColumns,
        true,
      );
      totalCount = (await countQuery.getRawOne()).count;
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }

    return results;
  }

  private buildAggregationQuery(
    params,
    selectColumns: string[],
    orderByColumns: string[],
    countQuery: boolean = false,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = null;

    if (countQuery) {
      query = this.createQueryBuilder('mud').select('COUNT(*) OVER() as count');
    } else {
      query = this.createQueryBuilder('mud').select(
        selectColumns.map((col) => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      );

      query
        .addSelect('SUM(mud.grossLoad)', 'grossLoad')
        .addSelect('SUM(mud.steamLoad)', 'steamLoad')
        .addSelect('SUM(mud.so2Mass)', 'so2Mass')
        .addSelect('SUM(mud.co2Mass)', 'co2Mass')
        .addSelect('SUM(mud.noxMass)', 'noxMass')
        .addSelect('SUM(mud.heatInput)', 'heatInput');
    }

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

    selectColumns.forEach((c) => query.addGroupBy(c));
    orderByColumns.forEach((c) => query.addOrderBy(c));

    return query;
  }
}
