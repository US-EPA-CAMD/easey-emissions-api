import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { MonthUnitData } from '../../entities/month-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  MonthlyApportionedEmissionsParamsDTO,
  PaginatedMonthlyApportionedEmissionsParamsDTO,
} from '../../dto/monthly-apportioned-emissions.params.dto';

@EntityRepository(MonthUnitData)
export class MonthUnitDataRepository extends Repository<MonthUnitData> {

  streamEmissions(
    params: MonthlyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedMonthlyApportionedEmissionsParamsDTO,
  ): Promise<MonthUnitData[]> {
    let totalCount: number;
    let results: MonthUnitData[];
    const { page, perPage } = params;
    let query = this.buildQuery(params);

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
      'mud.id',      
      'uf.stateCode',
      'uf.facilityName',
      'uf.facilityId',
      'uf.unitId',
      'uf.associatedStacks',
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
      'uf.primaryFuelInfo',
      'uf.secondaryFuelInfo',
      'uf.unitType',
      'uf.so2ControlInfo',
      'uf.pmControlInfo',
      'uf.noxControlInfo',
      'uf.hgControlInfo',
      'uf.programCodeInfo',
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
    isStreamed: boolean = false,
  ): SelectQueryBuilder<MonthUnitData> {
    let query = this.createQueryBuilder('mud')
      .select(this.getColumns(isStreamed))
      .innerJoin('mud.unitFact', 'uf');

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
      'mud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('mud.year')
      .addOrderBy('mud.month');

    return query;
  }
}
