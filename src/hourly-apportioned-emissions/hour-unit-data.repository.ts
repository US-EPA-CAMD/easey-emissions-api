import { Repository, EntityRepository } from 'typeorm';

import { HourUnitData } from '../entities/hour-unit-data.entity';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

@EntityRepository(HourUnitData)
export class HourUnitDataRepository extends Repository<HourUnitData> {
  async getHourlyEmissions(
    hourlyApportionedEmissionsParamsDTO: HourlyApportionedEmissionsParamsDTO,
  ): Promise<HourUnitData[]> {
    const {
      beginDate,
      endDate,
      state,
      orisCode,
      unitType,
      unitFuelType,
      controlTechnologies,
      opHoursOnly,
    } = hourlyApportionedEmissionsParamsDTO;

    const results = this.createQueryBuilder('hud')
      .select([
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
      ])
      .innerJoin('hud.unitFact', 'uf');

    if (beginDate) {
      results.andWhere('hud.opDate >= :beginDate', { beginDate: beginDate });
    }
    if (endDate) {
      results.andWhere('hud.opDate <= :endDate', { endDate: endDate });
    }
    if (state) {
      results.andWhere('uf.state = :state', { state: state });
    }

    if (orisCode) {
      results.andWhere('uf.orisCode = :orisCode', { orisCode: orisCode });
    }

    if (unitType) {
      results.andWhere('uf.unitTypeInfo = :unitType', { unitType: unitType });
    }

    if (unitFuelType) {
      results.andWhere(
        'uf.primaryFuelInfo = :unitFuelType OR uf.secondaryFuelInfo = :unitFuelType',
        {
          unitFuelType: unitFuelType,
        },
      );
    }

    if (controlTechnologies) {
      results.andWhere(
        'uf.so2ControlInfo = :controlTechnologies OR uf.noxControlInfo = :controlTechnologies OR uf.partControlInfo = :controlTechnologies OR uf.hgControlInfo = :controlTechnologies',
        {
          controlTechnologies: controlTechnologies,
        },
      );
    }

    if (String(opHoursOnly) === String(true)) {
      results.andWhere('hud.opTime > 0');
    }

    const query = await results.getMany();
    return query;
  }
}
