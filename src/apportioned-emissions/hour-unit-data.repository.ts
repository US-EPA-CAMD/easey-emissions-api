import { Repository, EntityRepository } from 'typeorm';
import { Request } from 'express';

import { HourUnitData } from '../entities/hour-unit-data.entity';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
import { ResponseHeaders } from '../utils/response.headers';
import { QueryBuilderHelper } from '../utils/query-builder.helper';

@EntityRepository(HourUnitData)
export class HourUnitDataRepository extends Repository<HourUnitData> {
  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
    req: Request,
  ): Promise<HourUnitData[]> {
    const { page, perPage } = hourlyApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('hud')
      .select([
        'hud.id',
        'hud.date',
        'hud.hour',
        'hud.opTime',
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
        'uf.state',
        'uf.facilityName',
        'uf.facilityId',
        'uf.unitId',
        'uf.primaryFuelInfo',
        'uf.secondaryFuelInfo',
        'uf.unitType',
        'uf.so2ControlInfo',
        'uf.pmControlInfo',
        'uf.noxControlInfo',
        'uf.hgControlInfo',
        'uf.programCodeInfo',
        'uf.associatedStacks',
      ])
      .innerJoin('hud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      hourlyApportionedEmissionsParamsDTO,
      [
        'beginDate',
        'endDate',
        'state',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'program',
        'opHoursOnly',
      ],
      'hud',
      'uf',
    );

    query
      .orderBy('uf.facilityId')
      .addOrderBy('uf.unitId')
      .addOrderBy('hud.date')
      .addOrderBy('hud.hour');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
