import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { DayUnitData } from '../../entities/day-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@EntityRepository(DayUnitData)
export class DayUnitDataRepository extends Repository<DayUnitData> {

  streamEmissions(
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitData[]> {
    let totalCount: number;
    let results: DayUnitData[];
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
      'dud.id',      
      'uf.stateCode',
      'uf.facilityName',
      'uf.facilityId',
      'uf.unitId',
      'uf.associatedStacks',
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
    params: DailyApportionedEmissionsParamsDTO,
    isStreamed: boolean = false,
  ): SelectQueryBuilder<DayUnitData> {
    let query = this.createQueryBuilder('dud')
      .select(this.getColumns(isStreamed))
      .innerJoin('dud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(query, params,
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
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('dud.date');

    return query;
  }
}
