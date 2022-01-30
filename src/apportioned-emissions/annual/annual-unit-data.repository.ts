import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { AnnualUnitData } from '../../entities/annual-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitData)
export class AnnualUnitDataRepository extends Repository<AnnualUnitData> {

  streamEmissions(
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitData[]> {
    let totalCount: number;
    let results: AnnualUnitData[];
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
      'aud.grossLoad',
      'aud.steamLoad',
      'aud.heatInput',
      'aud.so2Mass',
      'aud.so2Rate',
      'aud.co2Mass',
      'aud.co2Rate',
      'aud.noxMass',
      'aud.noxRate',
      'aud.year',
      'aud.sumOpTime',
      'aud.countOpTime',
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
    isStreamed: boolean = false,
  ): SelectQueryBuilder<AnnualUnitData> {
    let query = this.createQueryBuilder('aud')
      .select(this.getColumns(isStreamed))
      .innerJoin('aud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(query, params,
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
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('aud.year');

    return query;
  }
}
