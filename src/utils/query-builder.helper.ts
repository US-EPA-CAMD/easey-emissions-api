import { Regex } from './regex';

export class QueryBuilderHelper {
  public static createEmissionsQuery(
    query: any,
    dto: any,
    param: string[],
    emissionsAlias: string,
    unitAlias: string,
  ) {
    if (param.includes('beginDate') && dto.beginDate) {
      query.andWhere(`${emissionsAlias}.date >= :beginDate`, {
        beginDate: dto.beginDate,
      });
    }

    if (param.includes('endDate') && dto.endDate) {
      query.andWhere(`${emissionsAlias}.date <= :endDate`, {
        endDate: dto.endDate,
      });
    }

    if (param.includes('year') && dto.year) {
      query.andWhere(`${emissionsAlias}.year IN (:...years)`, {
        years: dto.year,
      });
    }

    if (param.includes('month') && dto.month) {
      query.andWhere(`${emissionsAlias}.month IN (:...months)`, {
        months: dto.month,
      });
    }

    if (param.includes('quarter') && dto.quarter) {
      query.andWhere(`${emissionsAlias}.quarter IN (:...quarters)`, {
        quarters: dto.quarter,
      });
    }

    if (param.includes('state') && dto.state) {
      query.andWhere(`${unitAlias}.state IN (:...states)`, {
        states: dto.state.map(states => {
          return states.toUpperCase();
        }),
      });
    }

    if (param.includes('facilityId') && dto.facilityId) {
      query.andWhere(`${unitAlias}.facilityId IN (:...facilityIds)`, {
        facilityIds: dto.facilityId,
      });
    }

    if (param.includes('unitType') && dto.unitType) {
      let string = '(';

      for (let i = 0; i < dto.unitType.length; i++) {
        const regex = Regex.commaDelimited(dto.unitType[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${unitAlias}.unitType) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${unitAlias}.unitType) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
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

        string += `OR (UPPER(${unitAlias}.pmControlInfo) ~* ${regex}) `;

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

    if (param.includes('programCodeInfo') && dto.programCodeInfo) {
      let string = '(';

      for (let i = 0; i < dto.programCodeInfo.length; i++) {
        const regex = Regex.commaDelimited(dto.programCodeInfo[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${unitAlias}.programCodeInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${unitAlias}.programCodeInfo) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
    }

    if (
      param.includes('operatingHoursOnly') &&
      String(dto.operatingHoursOnly) === String(true)
    ) {
      query.andWhere(`${emissionsAlias}.opTime > 0`);
    }

    if (dto.page && dto.perPage) {
      query = this.paginationHelper(query, dto.page, dto.perPage);
    }

    return query;
  }

  private static paginationHelper(query: any, page: number, perPage: number) {
    query.skip((page - 1) * perPage).take(perPage);
    return query;
  }
}
