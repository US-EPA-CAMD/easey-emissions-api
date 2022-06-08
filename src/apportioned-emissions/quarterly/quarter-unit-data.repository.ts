import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO,
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitDataView)
export class QuarterUnitDataRepository extends Repository<QuarterUnitDataView> {

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

  private buildQuery(
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

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let totalCount: number;
    let results: QuarterUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = [
      'aud.stateCode',
      'aud.facilityName',
      'aud.facilityId',
      'aud.year',
      'aud.quarter'
    ];
    const orderByColumns = ['aud.facilityId', 'aud.year', 'aud.quarter'];

    const query = this.buildAggregationQuery(
      params,
      selectColumns,
      orderByColumns,
    );

    results = await query.getRawMany();
    if (page && perPage) {
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
  ): SelectQueryBuilder<QuarterUnitDataView> {
    let query = null;

    if (countQuery) {
      query = this.createQueryBuilder('aud').select('COUNT(*) OVER() as count');
    } else {
      query = this.createQueryBuilder('aud').select(
        selectColumns.map(col => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      );

      query
        .addSelect('SUM(aud.grossLoad)', 'grossLoad')
        .addSelect('SUM(aud.steamLoad)', 'steamLoad')
        .addSelect('SUM(aud.so2Mass)', 'so2Mass')
        .addSelect('SUM(aud.co2Mass)', 'co2Mass')
        .addSelect('SUM(aud.noxMass)', 'noxMass')
        .addSelect('SUM(aud.heatInput)', 'heatInput');
    }

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
      'aud',
    );

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));

    return query;
  }
}
