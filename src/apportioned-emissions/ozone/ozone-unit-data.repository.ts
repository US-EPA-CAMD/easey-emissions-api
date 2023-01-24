import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO,
} from '../../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitDataView)
export class OzoneUnitDataRepository extends Repository<OzoneUnitDataView> {
  async getEmissions(
    req: Request,
    columns: any[],
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
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
    params: OzoneApportionedEmissionsParamsDTO,
    alias: boolean = false,
  ): SelectQueryBuilder<OzoneUnitDataView> {
    let query = this.createQueryBuilder('oud').select(
      alias
        ? columns.map(col => `oud.${col.value} AS "${col.value}"`)
        : columns.map(col => `oud.${col.value}`),
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'oud',
    );

    query
      .orderBy('oud.facilityId')
      .addOrderBy('oud.unitId')
      .addOrderBy('oud.year');

    return query;
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = [
      'oud.stateCode',
      'oud.facilityName',
      'oud.facilityId',
      'oud.year',
    ];
    const orderByColumns = ['oud.facilityId', 'oud.year'];

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
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['oud.stateCode', 'oud.year'];
    const orderByColumns = ['oud.stateCode', 'oud.year'];

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
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['oud.year'];
    const orderByColumns = ['oud.year'];

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
  ): SelectQueryBuilder<OzoneUnitDataView> {
    let query = null;

    if (countQuery) {
      query = this.createQueryBuilder('oud').select('COUNT(*) OVER() as count');
    } else {
      query = this.createQueryBuilder('oud').select(
        selectColumns.map(col => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      );

      query
        .addSelect('SUM(oud.grossLoad)', 'grossLoad')
        .addSelect('SUM(oud.steamLoad)', 'steamLoad')
        .addSelect('SUM(oud.so2Mass)', 'so2Mass')
        .addSelect('SUM(oud.co2Mass)', 'co2Mass')
        .addSelect('SUM(oud.noxMass)', 'noxMass')
        .addSelect('SUM(oud.heatInput)', 'heatInput');
    }

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'year',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'programCodeInfo',
      ],
      'oud',
    );

    selectColumns.forEach(c => query.addGroupBy(c));
    orderByColumns.forEach(c => query.addOrderBy(c));

    return query;
  }
}
