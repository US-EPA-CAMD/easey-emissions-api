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
      opHoursOnly,
      controlTechnologies,
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
        'uf.prgCodeInfo',
        'uf.assocStacks'
      ])
      .innerJoin('hud.unitFact', 'uf');

    if (beginDate) {
      results.andWhere('hud.opDate >= :beginDate', { beginDate: beginDate });
    }

    if (endDate) {
      results.andWhere('hud.opDate <= :endDate', { endDate: endDate });
    }

    if (state) {
      results.andWhere('uf.state IN (:...states)', {
        states: state.map(states => {
          return states.toUpperCase();
        }),
      });
    }
    if (orisCode) {
      results.andWhere('uf.orisCode IN (:...orisCodes)', {
        orisCodes: orisCode,
      });
    }

    if (unitType) {
      results.andWhere('UPPER(uf.unitTypeInfo) IN (:...unitType)', {
        unitType: unitType.map(unit => {
          return unit.toUpperCase();
        }),
      });
    }

    if (controlTechnologies) {
      let string = '(';

      for (let i = 0; i < controlTechnologies.length; i++) {

        const regex = `'((^${controlTechnologies[i].toUpperCase()
        }$)|([,][ ]*${controlTechnologies[i].toUpperCase()
        }$)|([,][ ]*${controlTechnologies[i].toUpperCase()
        }[,])|(^${controlTechnologies[i].toUpperCase()
        }[,])|(^${controlTechnologies[i].toUpperCase()
        } [(])|([,][ ]*${controlTechnologies[i].toUpperCase()} [(]))'`;

        if (i === 0 ) {
          string += `(UPPER(uf.so2_control_info) ~* ${regex}) `;
        }
        else {
          string += `OR (UPPER(uf.so2_control_info) ~* ${regex}) `;
        }

        string += `OR (UPPER(uf.nox_control_info) ~* ${regex}) `;

        string += `OR (UPPER(uf.part_control_info) ~* ${regex}) `;

        string += `OR (UPPER(uf.hg_control_info) ~* ${regex}) `;
      }

      string += ')';

      results.andWhere(string);
    }

    if (unitFuelType) {
      let string = '(';

      for (let i = 0; i < unitFuelType.length; i++) {

        const regex = `'((^${unitFuelType[i].toUpperCase()
        }$)|([,][ ]*${unitFuelType[i].toUpperCase()
        }$)|([,][ ]*${unitFuelType[i].toUpperCase()
        }[,])|(^${unitFuelType[i].toUpperCase()
        }[,])|(^${unitFuelType[i].toUpperCase()
        } [(])|([,][ ]*${unitFuelType[i].toUpperCase()} [(]))'`;

        if (i === 0 ) {
          string += `(UPPER(uf.primary_fuel_info) ~* ${regex}) `;
        }
        else {
          string += `OR (UPPER(uf.primary_fuel_info) ~* ${regex}) `;
        }

        string += `OR (UPPER(uf.secondary_fuel_info) ~* ${regex}) `;
      }

      string += ')';
      results.andWhere(string);
    }

    if (String(opHoursOnly) === String(true)) {
      results.andWhere('hud.opTime > 0');
    }

    return await results.getMany();
  }
}
