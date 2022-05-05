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
  getStreamQuery(params: StreamMonthlyApportionedEmissionsParamsDTO) {
    return this.buildQuery(params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    } else {
      results = await query.getMany();
    }

    return results;
  }

  private getColumns(isStreamed: boolean): string[] {
    const columns = [
      'mud.stateCode',
      'mud.facilityName',
      'mud.facilityId',
      'mud.unitId',
      'mud.associatedStacks',
      'mud.year',
      'mud.month',
      'mud.sumOpTime',
      'mud.countOpTime',
      'mud.grossLoad',
      'mud.steamLoad',
      'mud.so2Mass',
      'mud.so2Rate',
      'mud.co2Mass',
      'mud.co2Rate',
      'mud.noxMass',
      'mud.noxRate',
      'mud.heatInput',
      'mud.primaryFuelInfo',
      'mud.secondaryFuelInfo',
      'mud.unitType',
      'mud.so2ControlInfo',
      'mud.pmControlInfo',
      'mud.noxControlInfo',
      'mud.hgControlInfo',
      'mud.programCodeInfo',
    ];

    return columns.map(col => {
      if (isStreamed) {
        return `${col} AS "${col.split('.')[1]}"`;
      } else {
        return col;
      }
    });
  }

  private buildQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      this.getColumns(isStreamed),
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
    const query = this.buildFacilityAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  getFacilityStreamQuery(params: MonthlyApportionedEmissionsParamsDTO) {
    return this.buildFacilityAggregationQuery(params).getQueryAndParameters();
  }

  buildFacilityAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      [
        'mud.stateCode',
        'mud.facilityName',
        'mud.facilityId',
        'mud.year',
        'mud.month',
      ].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('mud.stateCode')
      .addGroupBy('mud.facilityName')
      .addGroupBy('mud.facilityId')
      .addGroupBy('mud.year')
      .addGroupBy('mud.month');

    query
      .orderBy('mud.facilityId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query;
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildStateAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  getStateStreamQuery(params: MonthlyApportionedEmissionsParamsDTO) {
    return this.buildStateAggregationQuery(params).getQueryAndParameters();
  }

  buildStateAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      ['mud.stateCode', 'mud.year', 'mud.month'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query
      .addGroupBy('mud.stateCode')
      .addGroupBy('mud.year')
      .addGroupBy('mud.month');

    query
      .orderBy('mud.stateCode')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query;
  }

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitDataView[]> {
    let totalCount: number;
    let results: MonthUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildNationalAggregationQuery(params);

    results = await query.getRawMany();
    if (page && perPage) {
      totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    return results;
  }

  getNationalStreamQuery(params: MonthlyApportionedEmissionsParamsDTO) {
    return this.buildNationalAggregationQuery(params).getQueryAndParameters();
  }

  buildNationalAggregationQuery(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud').select(
      ['mud.year', 'mud.month'].map(col => {
        return `${col} AS "${col.split('.')[1]}"`;
      }),
    );
    query = this.buildAggregationQuery(query, params);
    query.addGroupBy('mud.year').addGroupBy('mud.month');
    query.addOrderBy('mud.year').addOrderBy('mud.month');

    return query;
  }

  buildAggregationQuery(query, params): SelectQueryBuilder<MonthUnitDataView> {
    query
      .addSelect('SUM(mud.grossLoad)', 'grossLoad')
      .addSelect('SUM(mud.steamLoad)', 'steamLoad')
      .addSelect('SUM(mud.so2Mass)', 'so2Mass')
      .addSelect('SUM(mud.co2Mass)', 'co2Mass')
      .addSelect('SUM(mud.noxMass)', 'noxMass')
      .addSelect('SUM(mud.heatInput)', 'heatInput');

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

    return query;
  }
}
