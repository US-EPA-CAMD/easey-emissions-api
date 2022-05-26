import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@EntityRepository(DayUnitDataView)
export class DayUnitDataRepository extends Repository<DayUnitDataView> {

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

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildFacilityAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  private buildFacilityAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      ['dud.stateCode', 'dud.facilityName', 'dud.facilityId', 'dud.date'].map(
        col => {
          return `${col} AS "${col.split('.')[1]}"`;
        },
      ),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('dud.stateCode')
      .addGroupBy('dud.facilityName')
      .addGroupBy('dud.facilityId')
      .addGroupBy('dud.date');

    query.orderBy('dud.facilityId').addOrderBy('dud.date');

    return query;
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildStateAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  private buildStateAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      ['dud.stateCode', 'dud.date'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query.addGroupBy('dud.stateCode').addGroupBy('dud.date');

    query.orderBy('dud.stateCode').addOrderBy('dud.date');

    return query;
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildNationalAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  private buildNationalAggregationQuery(
    params: DailyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      ['dud.date'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query.addGroupBy('dud.date');
    query.addOrderBy('dud.date');

    return query;
  }

  private buildAggregationQuery(query, params): SelectQueryBuilder<DayUnitDataView> {
    query
      .addSelect('SUM(dud.grossLoad)', 'grossLoad')
      .addSelect('SUM(dud.steamLoad)', 'steamLoad')
      .addSelect('SUM(dud.so2Mass)', 'so2Mass')
      .addSelect('SUM(dud.co2Mass)', 'co2Mass')
      .addSelect('SUM(dud.noxMass)', 'noxMass')
      .addSelect('SUM(dud.heatInput)', 'heatInput');

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

    return query;
  }
}
