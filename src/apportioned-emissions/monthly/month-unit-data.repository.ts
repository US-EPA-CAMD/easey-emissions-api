import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { MonthUnitDataView } from '../../entities/vw-month-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@EntityRepository(MonthUnitDataView)
export class MonthUnitDataRepository extends Repository<MonthUnitDataView> {

  streamEmissions(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
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
      ResponseHeaders.setPagination(req, totalCount);
    }
    else {
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
    isStreamed?: boolean,
  ): SelectQueryBuilder<MonthUnitDataView> {
    let query = this.createQueryBuilder('mud')
      .select(this.getColumns(isStreamed));

    query = QueryBuilderHelper.createEmissionsQuery(query, params,
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
      'mud'
    );

    query
      .orderBy('mud.facilityId')
      .addOrderBy('mud.unitId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query;
  }
}
