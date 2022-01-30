import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../../utils/response.headers';
import { OzoneUnitData } from '../../entities/ozone-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import { 
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO
} from '../../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitData)
export class OzoneUnitDataRepository extends Repository<OzoneUnitData> {

  streamEmissions(
    params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitData[]> {
    let totalCount: number;
    let results: OzoneUnitData[];
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
      'oud.grossLoad',
      'oud.steamLoad',
      'oud.heatInput',
      'oud.so2Mass',
      'oud.so2Rate',
      'oud.co2Mass',
      'oud.co2Rate',
      'oud.noxMass',
      'oud.noxRate',
      'oud.year',
      'oud.sumOpTime',
      'oud.countOpTime',
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
    params: OzoneApportionedEmissionsParamsDTO,
    isStreamed: boolean = false,
  ): SelectQueryBuilder<OzoneUnitData> {
    let query = this.createQueryBuilder('oud')
      .select(this.getColumns(isStreamed))
      .innerJoin('oud.unitFact', 'uf');

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
      'oud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('oud.year');

    return query;
  }
}
