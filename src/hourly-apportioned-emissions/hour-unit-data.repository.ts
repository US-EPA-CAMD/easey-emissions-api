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

    let query = this.createQueryBuilder('em')
      .select([
        'em.unitId',
        'em.opDate',
        'em.opHour',
        'em.opTime',
        'em.gload',
        'em.sload',
        'em.heatInput',
        'em.so2Mass',
        'em.so2MassMeasureFlg',
        'em.so2Rate',
        'em.so2RateMeasureFlg',
        'em.co2Mass',
        'em.co2MassMeasureFlg',
        'em.co2Rate',
        'em.co2RateMeasureFlg',
        'em.noxMass',
        'em.noxMassMeasureFlg',
        'em.noxRate',
        'em.noxRateMeasureFlg',
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
      .innerJoin('em.unitFact', 'uf');

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
    ]);

    query
      .orderBy('uf.orisCode')
      .addOrderBy('em.unitId')
      .addOrderBy('em.opDate')
      .addOrderBy('em.opHour');

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);

      const totalCount = await query.getCount();
      ResponseHeaders.setPagination(req, totalCount);
    }

    return query.getMany();
  }
}
