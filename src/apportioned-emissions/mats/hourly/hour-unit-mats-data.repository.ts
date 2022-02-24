import { Request } from 'express';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QueryBuilderHelper } from '../../../utils/query-builder.helper';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import {
  HourlyMatsApportionedEmissionsParamsDTO,
  PaginatedHourlyMatsApportionedEmissionsParamsDTO,
} from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';

@EntityRepository(HourUnitMatsDataView)
export class HourUnitMatsDataRepository extends Repository<
  HourUnitMatsDataView
> {
  async getEmissions(
    req: Request,
    params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<HourUnitMatsDataView[]> {
    let totalCount: number;
    let results: HourUnitMatsDataView[];
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
      'humd.stateCode',
      'humd.facilityName',
      'humd.facilityId',
      'humd.unitId',
      'humd.date',
      'humd.hour',
      'humd.opTime',
      'humd.matsGrossLoad',
      'humd.matsHeatInput',
      'humd.hgOutputRate',
      'humd.hgInputRate',
      'humd.hgMass',
      'humd.hgMassMeasureFlg',
      'humd.hclOutputRate',
      'humd.hclInputRate',
      'humd.hclMass',
      'humd.hclMassMeasureFlg',
      'humd.hfOutputRate',
      'humd.hfInputRate',
      'humd.hfMass',
      'humd.hfMassMeasureFlg',
      'humd.associatedStacks',
      'humd.steamLoad',
      'humd.primaryFuelInfo',
      'humd.secondaryFuelInfo',
      'humd.unitType',
      'humd.so2ControlInfo',
      'humd.pmControlInfo',
      'humd.noxControlInfo',
      'humd.hgControlInfo',
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
    params: HourlyMatsApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<HourUnitMatsDataView> {
    let query = this.createQueryBuilder('humd').select(
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
        'operatingHoursOnly',
      ],
      'humd',
    );

    query
      .orderBy('humd.facilityId')
      .addOrderBy('humd.unitId')
      .addOrderBy('humd.date')
      .addOrderBy('humd.hour');

    return query;
  }
}
