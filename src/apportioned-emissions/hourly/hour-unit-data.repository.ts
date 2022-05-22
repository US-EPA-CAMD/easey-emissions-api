import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { HourUnitDataView } from '../../entities/vw-hour-unit-data.entity';
import { QueryBuilderHelper } from '../../utils/query-builder.helper';
import {
  HourlyApportionedEmissionsParamsDTO,
  PaginatedHourlyApportionedEmissionsParamsDTO,
  StreamHourlyApportionedEmissionsParamsDTO,
} from '../../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitDataView)
export class HourUnitDataRepository extends Repository<HourUnitDataView> {

  getQuery(params: StreamHourlyApportionedEmissionsParamsDTO) {
    return this.buildQuery(params, true).getQueryAndParameters();
  }

  async getEmissions(
    req: Request,
    params: PaginatedHourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitDataView[]> {
    let totalCount: number;
    let results: HourUnitDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    } else {
      results = await query.getMany();
    }

    return results;
  }

  private getColumns(isStreamed: boolean): string[] {
    const columns = [
      'hud.stateCode',
      'hud.facilityName',
      'hud.facilityId',
      'hud.unitId',
      'hud.associatedStacks',
      'hud.date',
      'hud.hour',
      'hud.opTime',
      'hud.grossLoad',
      'hud.steamLoad',
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
      'hud.heatInput',
      'hud.primaryFuelInfo',
      'hud.secondaryFuelInfo',
      'hud.unitType',
      'hud.so2ControlInfo',
      'hud.pmControlInfo',
      'hud.noxControlInfo',
      'hud.hgControlInfo',
      'hud.programCodeInfo',
    ];

    return columns.map(col => {
      if (isStreamed) {
        return `${col} AS "${col.split('.')[1]}"`;
      } else {
        return col;
      }
    });
  }

  buildQuery(
    params: HourlyApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<HourUnitDataView> {
    let query = this.createQueryBuilder('hud').select(
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
        'operatingHoursOnly',
      ],
      'hud',
    );

    query
      .orderBy('hud.facilityId')
      .addOrderBy('hud.unitId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    return query;
  }
}
