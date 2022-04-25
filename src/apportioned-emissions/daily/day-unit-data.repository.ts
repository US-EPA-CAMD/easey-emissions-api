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
  getStreamQuery(params: StreamDailyApportionedEmissionsParamsDTO) {
    return this.buildQuery(params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
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
      'dud.stateCode',
      'dud.facilityName',
      'dud.facilityId',
      'dud.unitId',
      'dud.associatedStacks',
      'dud.date',
      'dud.sumOpTime',
      'dud.countOpTime',
      'dud.grossLoad',
      'dud.steamLoad',
      'dud.so2Mass',
      'dud.so2Rate',
      'dud.co2Mass',
      'dud.co2Rate',
      'dud.noxMass',
      'dud.noxRate',
      'dud.heatInput',
      'dud.primaryFuelInfo',
      'dud.secondaryFuelInfo',
      'dud.unitType',
      'dud.so2ControlInfo',
      'dud.pmControlInfo',
      'dud.noxControlInfo',
      'dud.hgControlInfo',
      'dud.programCodeInfo',
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
    params: DailyApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      this.getColumns(isStreamed),
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

  getFacilityStreamQuery(params: DailyApportionedEmissionsParamsDTO) {
    return this.buildFacilityAggregationQuery(params).getQueryAndParameters();
  }

  buildFacilityAggregationQuery(
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

  getStateStreamQuery(params: DailyApportionedEmissionsParamsDTO) {
    return this.buildStateAggregationQuery(params).getQueryAndParameters();
  }

  buildStateAggregationQuery(
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

  getNationalStreamQuery(params: DailyApportionedEmissionsParamsDTO) {
    return this.buildNationalAggregationQuery(params).getQueryAndParameters();
  }

  buildNationalAggregationQuery(
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

  buildAggregationQuery(query, params): SelectQueryBuilder<DayUnitDataView> {
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
