import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { AnnualUnitDataView } from '../../entities/vw-annual-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  AnnualApportionedEmissionsParamsDTO,
  PaginatedAnnualApportionedEmissionsParamsDTO,
} from '../../dto/annual-apportioned-emissions.params.dto';

@EntityRepository(AnnualUnitDataView)
export class AnnualUnitDataRepository extends Repository<AnnualUnitDataView> {

  streamEmissions(
    params: AnnualApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedAnnualApportionedEmissionsParamsDTO,
  ): Promise<AnnualUnitDataView[]> {
    let totalCount: number;
    let results: AnnualUnitDataView[];
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
    isStreamed: boolean = false,
  ): SelectQueryBuilder<AnnualUnitDataView> {
    let query = this.createQueryBuilder('aud')
      .select(this.getColumns(isStreamed));

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
      'aud'
    );

    query
      .orderBy('aud.facilityId')
      .addOrderBy('aud.unitId')
      .addOrderBy('aud.year');

    return query;
  }
}
