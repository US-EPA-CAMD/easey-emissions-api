import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  QuarterlyApportionedEmissionsParamsDTO,
  PaginatedQuarterlyApportionedEmissionsParamsDTO
} from '../../dto/quarterly-apportioned-emissions.params.dto';

@EntityRepository(QuarterUnitDataView)
export class QuarterUnitDataRepository extends Repository<QuarterUnitDataView> {

  streamEmissions(
    params: QuarterlyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedQuarterlyApportionedEmissionsParamsDTO,
  ): Promise<QuarterUnitDataView[]> {
    let totalCount: number;
    let results: QuarterUnitDataView[];
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
      'qud.stateCode',
      'qud.facilityName',
      'qud.facilityId',
      'qud.unitId',
      'qud.associatedStacks',
      'qud.year',
      'qud.quarter',
      'qud.sumOpTime',
      'qud.countOpTime',
      'qud.grossLoad',
      'qud.steamLoad',
      'qud.so2Mass',
      'qud.so2Rate',
      'qud.co2Mass',
      'qud.co2Rate',
      'qud.noxMass',
      'qud.noxRate',
      'qud.heatInput',
      'qud.primaryFuelInfo',
      'qud.secondaryFuelInfo',
      'qud.unitType',
      'qud.so2ControlInfo',
      'qud.pmControlInfo',
      'qud.noxControlInfo',
      'qud.hgControlInfo',
      'qud.programCodeInfo',
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
  ): SelectQueryBuilder<QuarterUnitDataView> {
    let query = this.createQueryBuilder('qud')
      .select(this.getColumns(isStreamed));

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
      'qud'
    );

    query
      .orderBy('qud.facilityId')
      .addOrderBy('qud.unitId')
      .addOrderBy('qud.year')
      .addOrderBy('qud.quarter');

    return query;
  }
}
