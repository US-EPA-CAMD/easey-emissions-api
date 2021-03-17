import { Regex } from './regex';

export class QueryBuilderHelper {
  public static createEmissionsQuery(query: any, dto: any, param: string[]) {
    if (param.includes('beginDate') && dto.beginDate) {
      query.andWhere('em.opDate >= :beginDate', { beginDate: dto.beginDate });
    }

    if (param.includes('endDate') && dto.endDate) {
      query.andWhere('em.opDate <= :endDate', { endDate: dto.endDate });
    }

    if (param.includes('state') && dto.state) {
      query.andWhere('uf.state IN (:...states)', {
        states: dto.state.map(states => {
          return states.toUpperCase();
        }),
      });
    }

    if (param.includes('orisCode') && dto.orisCode) {
      query.andWhere('uf.orisCode IN (:...orisCodes)', {
        orisCodes: dto.orisCode,
      });
    }

    if (param.includes('unitType') && dto.unitType) {
      query.andWhere('UPPER(uf.unitTypeInfo) IN (:...unitType)', {
        unitType: dto.unitType.map(unit => {
          return unit.toUpperCase();
        }),
      });
    }

    if (param.includes('controlTechnologies') && dto.controlTechnologies) {
      let string = '(';

      for (let i = 0; i < dto.controlTechnologies.length; i++) {
        const regex = Regex.commaDelimited(
          dto.controlTechnologies[i].toUpperCase(),
        );

        if (i === 0) {
          string += `(UPPER(uf.so2ControlInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(uf.so2ControlInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(uf.noxControlInfo) ~* ${regex}) `;

        string += `OR (UPPER(uf.partControlInfo) ~* ${regex}) `;

        string += `OR (UPPER(uf.hgControlInfo) ~* ${regex}) `;
      }

      string += ')';

      query.andWhere(string);
    }

    if (param.includes('unitFuelType') && dto.unitFuelType) {
      let string = '(';

      for (let i = 0; i < dto.unitFuelType.length; i++) {
        const regex = Regex.commaDelimited(dto.unitFuelType[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(uf.primaryFuelInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(uf.primaryFuelInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(uf.secondaryFuelInfo) ~* ${regex}) `;
      }

      string += ')';
      query.andWhere(string);
    }

    if (param.includes('program') && dto.program) {
      let string = '(';

      for (let i = 0; i < dto.program.length; i++) {
        const regex = Regex.commaDelimited(dto.program[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(uf.prgCodeInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(uf.prgCodeInfo) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
    }

    if (
      param.includes('opHoursOnly') &&
      String(dto.opHoursOnly) === String(true)
    ) {
      query.andWhere('em.opTime > 0');
    }

    return query;
  }
}
