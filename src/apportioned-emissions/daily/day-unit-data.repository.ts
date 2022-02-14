import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { DayUnitDataView } from '../../entities/vw-day-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  DailyApportionedEmissionsParamsDTO,
  PaginatedDailyApportionedEmissionsParamsDTO,
} from '../../dto/daily-apportioned-emissions.params.dto';

@EntityRepository(DayUnitDataView)
export class DayUnitDataRepository extends Repository<DayUnitDataView> {
  streamEmissions(
    params: DailyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: PaginatedDailyApportionedEmissionsParamsDTO,
  ): Promise<DayUnitDataView[]> {
    let totalCount: number;
    let results: DayUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, totalCount);
    } else {
      results = await query.getMany();
    }

    return results;
  }

  private getColumns(isStreamed: boolean): string[] {
    const columns = [
      'dud.stateCode',
      'dud.facilityName',
      'dud.facilityId',
      'dud.unitId',
      'dud.associatedStacks',
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
      'dud.primaryFuelInfo',
      'dud.secondaryFuelInfo',
      'dud.unitType',
      'dud.so2ControlInfo',
      'dud.pmControlInfo',
      'dud.noxControlInfo',
      'dud.hgControlInfo',
      'dud.programCodeInfo',
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
    isStreamed = false,
  ): SelectQueryBuilder<DayUnitDataView> {
    let query = this.createQueryBuilder('dud').select(
      this.getColumns(isStreamed),
    );

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
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
    );

    query
      .orderBy('dud.facilityId')
      .addOrderBy('dud.unitId')
      .addOrderBy('dud.date');

    return query;
  }
}
