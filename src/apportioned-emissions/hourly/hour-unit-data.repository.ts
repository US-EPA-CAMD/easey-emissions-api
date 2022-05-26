import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitDataView)
export class HourUnitDataRepository extends Repository<HourUnitDataView> {

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

  private buildQuery(
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

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let totalCount: number;
    let results: HourUnitDataView[];
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
    params: HourlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      [
        'hud.stateCode',
        'hud.facilityName',
        'hud.facilityId',
        'hud.date',
        'hud.hour',
      ].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('hud.stateCode')
      .addGroupBy('hud.facilityName')
      .addGroupBy('hud.facilityId')
      .addGroupBy('hud.date')
      .addGroupBy('hud.hour');

    query
      .orderBy('hud.facilityId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let totalCount: number;
    let results: HourUnitDataView[];
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
    params: HourlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      ['hud.stateCode', 'hud.date', 'hud.hour'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('hud.stateCode')
      .addGroupBy('hud.date')
      .addGroupBy('hud.hour');

    query
      .orderBy('hud.stateCode')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let totalCount: number;
    let results: HourUnitDataView[];
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
    params: HourlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
      ['hud.date', 'hud.hour'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query.addGroupBy('hud.date').addGroupBy('hud.hour');
    query.addOrderBy('hud.date').addOrderBy('hud.hour');

    return query;
  }

  private buildAggregationQuery(query, params): SelectQueryBuilder<HourUnitDataView> {
    query
      .addSelect('SUM(hud.grossLoad)', 'grossLoad')
      .addSelect('SUM(hud.steamLoad)', 'steamLoad')
      .addSelect('SUM(hud.so2Mass)', 'so2Mass')
      .addSelect('SUM(hud.co2Mass)', 'co2Mass')
      .addSelect('SUM(hud.noxMass)', 'noxMass')
      .addSelect('SUM(hud.heatInput)', 'heatInput');

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

    return query;
  }
}
