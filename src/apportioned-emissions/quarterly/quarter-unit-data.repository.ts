import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { QuarterUnitData } from '../../entities/quarter-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitData)
export class QuarterUnitDataRepository extends Repository<QuarterUnitData> {

  streamEmissions(
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitData[]> {
    let totalCount: number;
    let results: QuarterUnitData[];
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
      'uf.stateCode',
      'uf.facilityName',
      'uf.facilityId',
      'uf.unitId',
      'uf.unitType',
      'uf.primaryFuelInfo',
      'uf.secondaryFuelInfo',
      'uf.so2ControlInfo',
      'uf.pmControlInfo',
      'uf.noxControlInfo',
      'uf.hgControlInfo',
      'uf.programCodeInfo',
      'uf.associatedStacks',
      'qud.grossLoad',
      'qud.steamLoad',
      'qud.heatInput',
      'qud.so2Mass',
      'qud.so2Rate',
      'qud.co2Mass',
      'qud.co2Rate',
      'qud.noxMass',
      'qud.noxRate',
      'qud.year',
      'qud.quarter',
      'qud.sumOpTime',
      'qud.countOpTime',
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
    params: QuarterlyApportionedEmissionsParamsDTO,
    isStreamed: boolean = false,
  ): SelectQueryBuilder<QuarterUnitData> {
    let query = this.createQueryBuilder('qud')
      .select(this.getColumns(isStreamed))
      .innerJoin('qud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(query, params,
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
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('qud.year')
      .addOrderBy('qud.quarter');

    return query;
  }
}
