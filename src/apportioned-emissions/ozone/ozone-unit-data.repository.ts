import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { OzoneUnitDataView } from '../../entities/vw-ozone-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  OzoneApportionedEmissionsParamsDTO,
  PaginatedOzoneApportionedEmissionsParamsDTO
} from '../../dto/ozone-apportioned-emissions.params.dto';

@EntityRepository(OzoneUnitDataView)
export class OzoneUnitDataRepository extends Repository<OzoneUnitDataView> {

  streamEmissions(
    params: OzoneApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedOzoneApportionedEmissionsParamsDTO,
  ): Promise<OzoneUnitDataView[]> {
    let totalCount: number;
    let results: OzoneUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    }
    else {
      results = await query.getMany();
    }

    return results;
  }

  private getColumns(isStreamed: boolean): string[] {
    const columns = [
      'oud.stateCode',
      'oud.facilityName',
      'oud.facilityId',
      'oud.unitId',
      'oud.associatedStacks',
      'oud.year',
      'oud.sumOpTime',
      'oud.countOpTime',
      'oud.grossLoad',
      'oud.steamLoad',
      'oud.so2Mass',
      'oud.so2Rate',
      'oud.co2Mass',
      'oud.co2Rate',
      'oud.noxMass',
      'oud.noxRate',
      'oud.heatInput',
      'oud.primaryFuelInfo',
      'oud.secondaryFuelInfo',
      'oud.unitType',
      'oud.so2ControlInfo',
      'oud.pmControlInfo',
      'oud.noxControlInfo',
      'oud.hgControlInfo',
      'oud.programCodeInfo',
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
    isStreamed = false,
  ): SelectQueryBuilder<OzoneUnitDataView> {
    let query = this.createQueryBuilder('oud')
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
      'oud'
    );

    query
      .orderBy('oud.facilityId')
      .addOrderBy('oud.unitId')
      .addOrderBy('oud.year');

    return query;
  }
}
