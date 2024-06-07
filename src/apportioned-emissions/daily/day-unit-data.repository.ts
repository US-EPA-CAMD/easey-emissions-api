import { Injectable } from '@nestjs/common';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import { Request } from 'express';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';

@Injectable()
export class DayUnitDataRepository extends Repository<DayUnitDataView> {
  constructor(entityManager: EntityManager) {
    super(DayUnitDataView, entityManager);
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

  private buildQuery(
    columns: any[],
    params: DailyApportionedEmissionsParamsDTO,
    alias: boolean = false,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      alias
        ? columns.map(col => `dud.${col.value} AS "${col.value}"`)
        : columns.map(col => `dud.${col.value}`),
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

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = [
      'dud.stateCode',
      'dud.facilityName',
      'dud.facilityId',
      'dud.date',
    ];
    const orderByColumns = ['dud.facilityId', 'dud.date'];

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
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['dud.stateCode', 'dud.date'];
    const orderByColumns = ['dud.stateCode', 'dud.date'];

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
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['dud.date'];
    const orderByColumns = ['dud.date'];

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
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = null;

    if (countQuery) {
      query = this.createQueryBuilder('dud').select('COUNT(*) OVER() as count');
    } else {
      query = this.createQueryBuilder('dud').select(
        selectColumns.map(col => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      );

      query
        .addSelect('SUM(dud.grossLoad)', 'grossLoad')
        .addSelect('SUM(dud.steamLoad)', 'steamLoad')
        .addSelect('SUM(dud.so2Mass)', 'so2Mass')
        .addSelect('SUM(dud.co2Mass)', 'co2Mass')
        .addSelect('SUM(dud.noxMass)', 'noxMass')
        .addSelect('SUM(dud.heatInput)', 'heatInput');
    }

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

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));

    return query;
  }
}
