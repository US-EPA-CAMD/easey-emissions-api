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
    const {
      page,
      perPage,
    } = hourlyApportionedEmissionsParamsDTO;

    let query = this.createQueryBuilder('hud')
      .select([
        'hud.unitId',
        'hud.opDate',
        'hud.opHour',
        'hud.opTime',
        'hud.gload',
        'hud.sload',
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
        'uf.orisCode',
        'uf.unitid',
        'uf.primaryFuelInfo',
        'uf.secondaryFuelInfo',
        'uf.unitTypeInfo',
        'uf.so2ControlInfo',
        'uf.partControlInfo',
        'uf.noxControlInfo',
        'uf.hgControlInfo',
        'uf.prgCodeInfo',
        'uf.assocStacks',
      ])
      .innerJoin('hud.unitFact', 'uf');

    query = QueryBuilderHelper.createEmissionsQuery(query, hourlyApportionedEmissionsParamsDTO, [
      'beginDate',
      'endDate',
      'state',
      'orisCode',
      'unitType',
      'controlTechnologies',
      'unitFuelType',
      'program',
      'opHoursOnly',
    ], 'hud', 'uf');

    query
      .orderBy('uf.orisCode')
      .addOrderBy('hud.unitId')
      .addOrderBy('hud.opDate')
      .addOrderBy('hud.opHour');

    if (page && perPage) {
      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
