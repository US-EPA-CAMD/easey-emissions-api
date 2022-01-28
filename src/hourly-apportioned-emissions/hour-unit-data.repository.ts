import { ReadStream } from 'fs';
import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { ResponseHeaders } from '../utils/response.headers';
import { HourUnitData } from '../entities/hour-unit-data.entity';
import { QueryBuilderHelper } from '../utils/query-builder.helper';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitData)
export class HourUnitDataRepository extends Repository<HourUnitData> {

  streamEmissions(
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<ReadStream> {
    return this.buildQuery(params, true).stream();
  }

  async getEmissions(
    req: Request,
    params: HourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitData[]> {
    let totalCount: number;
    let results: HourUnitData[];
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
      'hud.id',
      'uf.stateCode',
      'uf.facilityName',
      'uf.facilityId',
      'uf.unitId',
      'uf.unitType',
      'uf.associatedStacks',
      'uf.primaryFuelInfo',
      'uf.secondaryFuelInfo',
      'uf.so2ControlInfo',
      'uf.pmControlInfo',
      'uf.noxControlInfo',
      'uf.hgControlInfo',
      'uf.programCodeInfo',
      'hud.grossLoad',
      'hud.steamLoad',
      'hud.heatInput',
      'hud.so2Mass',
      'hud.so2MassMeasureFlg',
      'hud.so2Rate',
      'hud.so2RateMeasureFlg',
      'hud.co2Mass',
      'hud.co2MassMeasureFlg',
      'hud.co2Rate',
      'hud.co2RateMeasureFlg',
      'hud.noxMass',
      'hud.noxMassMeasureFlg',
      'hud.noxRate',
      'hud.noxRateMeasureFlg',
      'hud.date',
      'hud.hour',
      'hud.opTime',
    ];

    return columns.map(col => {
      if (isStreamed) {
        return `${col} AS ${col.split('.')[1]}`;
      } else {
        return col;
      }
    });
  }

  private buildQuery(
    params: HourlyApportionedEmissionsParamsDTO,
    isStreamed: boolean = false,
  ): SelectQueryBuilder<HourUnitData> {
    let query = this.createQueryBuilder('hud')
      .select(this.getColumns(isStreamed))
      .innerJoin('hud.unitFact', 'uf');

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
        'operatingHoursOnly',
      ],
      'hud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }
}
