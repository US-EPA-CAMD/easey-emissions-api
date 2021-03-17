import { Regex } from './regex';

export class QueryBuilderHelper {
  public static createEmissionsQuery(query: any, dto: any, param: string[], emissionsAlias: string, unitAlias: string) {
    if (param.includes('beginDate') && dto.beginDate) {
      query.andWhere(`${emissionsAlias}.opDate >= :beginDate`, { beginDate: dto.beginDate });
    }

    if (param.includes('endDate') && dto.endDate) {
      query.andWhere(`${emissionsAlias}.opDate <= :endDate`, { endDate: dto.endDate });
    }

    if (param.includes('state') && dto.state) {
      query.andWhere(`${unitAlias}.state IN (:...states)`, {
        states: dto.state.map(states => {
          return states.toUpperCase();
        }),
      });
    }

    if (param.includes('orisCode') && dto.orisCode) {
      query.andWhere(`${unitAlias}.orisCode IN (:...orisCodes)`, {
        orisCodes: dto.orisCode,
      });
    }

    if (param.includes('unitType') && dto.unitType) {
      query.andWhere(`UPPER(${unitAlias}.unitTypeInfo) IN (:...unitType)`, {
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
          string += `(UPPER(${unitAlias}.so2ControlInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${unitAlias}.so2ControlInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(${unitAlias}.noxControlInfo) ~* ${regex}) `;

        string += `OR (UPPER(${unitAlias}.partControlInfo) ~* ${regex}) `;

        string += `OR (UPPER(${unitAlias}.hgControlInfo) ~* ${regex}) `;
      }

      string += ')';

      query.andWhere(string);
    }

    if (param.includes('unitFuelType') && dto.unitFuelType) {
      let string = '(';

      for (let i = 0; i < dto.unitFuelType.length; i++) {
        const regex = Regex.commaDelimited(dto.unitFuelType[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${unitAlias}.primaryFuelInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${unitAlias}.primaryFuelInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(${unitAlias}.secondaryFuelInfo) ~* ${regex}) `;
      }

      string += ')';
      query.andWhere(string);
    }

    if (param.includes('program') && dto.program) {
      let string = '(';

      for (let i = 0; i < dto.program.length; i++) {
        const regex = Regex.commaDelimited(dto.program[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${unitAlias}.prgCodeInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${unitAlias}.prgCodeInfo) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
    }

    if (
      param.includes('opHoursOnly') &&
      String(dto.opHoursOnly) === String(true)
    ) {
      query.andWhere(`${emissionsAlias}.opTime > 0`);
    }

    if (dto.page && dto.perPage) {
      query = this.paginationHelper(query, dto.page, dto.perPage);
    }

    return query;
  }

  // TODO: createAllowanceQuery 

  private static paginationHelper(query: any, page: number, perPage: number) {
    query.skip((page - 1) * perPage).take(perPage);
    return query;
  }
}
