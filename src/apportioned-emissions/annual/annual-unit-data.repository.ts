import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
  StreamAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitDataView)
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {
  getStreamQuery(params: StreamAnnualApportionedEmissionsParamsDTO) {
    return this.buildQuery(params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
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
      'aud.stateCode',
      'aud.facilityName',
      'aud.facilityId',
      'aud.unitId',
      'aud.associatedStacks',
      'aud.year',
      'aud.sumOpTime',
      'aud.countOpTime',
      'aud.grossLoad',
      'aud.steamLoad',
      'aud.so2Mass',
      'aud.so2Rate',
      'aud.co2Mass',
      'aud.co2Rate',
      'aud.noxMass',
      'aud.noxRate',
      'aud.heatInput',
      'aud.primaryFuelInfo',
      'aud.secondaryFuelInfo',
      'aud.unitType',
      'aud.so2ControlInfo',
      'aud.pmControlInfo',
      'aud.noxControlInfo',
      'aud.hgControlInfo',
      'aud.programCodeInfo',
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
    params: AnnualApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<AnnualUnitDataView> {
    let query = this.createQueryBuilder('aud').select(
      this.getColumns(isStreamed),
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
      'aud',
    );

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query;
  }

  async getEmissionsFacilityAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = [
      'aud.stateCode',
      'aud.facilityName',
      'aud.facilityId',
      'aud.year',
    ];
    const orderByColumns = ['aud.facilityId', 'aud.year'];

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

  async getEmissionsNationalAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['aud.year'];
    const orderByColumns = ['aud.year'];

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

  getFacilityStreamQuery(params: AnnualApportionedEmissionsParamsDTO) {
    const columns = [
      'aud.stateCode',
      'aud.facilityName',
      'aud.facilityId',
      'aud.year',
    ];
    const orderByColumns = ['aud.facilityId', 'aud.year'];

    return this.buildAggregationQuery(
      params,
      columns,
      orderByColumns,
    ).getQueryAndParameters();
  }

  async getEmissionsStateAggregation(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
    const { page, perPage } = params;

    const selectColumns = ['aud.stateCode', 'aud.year'];
    const orderByColumns = ['aud.stateCode', 'aud.year'];

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

  buildAggregationQuery(
    params,
    selectColumns: string[],
    orderByColumns: string[],
    countQuery: boolean = false,
  ): SelectQueryBuilder<AnnualUnitDataView> {
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
