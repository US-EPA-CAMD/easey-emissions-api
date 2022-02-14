import { Regex } from '@us-epa-camd/easey-common/utilities';

export class QueryBuilderHelper {

  public static whereBeginDate(query: any, beginDate: Date, params: string[], alias: string) {
    if (params.includes('beginDate') && beginDate) {
      query.andWhere(`${alias}.date >= :beginDate`, {
        beginDate: beginDate,
      });
    }

    return query;
  }

  public static whereEndDate(query: any, endDate: Date, params: string[], alias: string) {
    if (params.includes('endDate') && endDate) {
      query.andWhere(`${alias}.date <= :endDate`, {
        endDate: endDate,
      });
    }

    return query;
  }

  public static whereYear(query: any, year: number[], params: string[], alias: string) {
    if (params.includes('year') && year) {
      query.andWhere(`${alias}.year IN (:...years)`, {
        years: year,
      });
    }

    return query;
  }

  public static whereQuarter(query: any, quarter: number[], params: string[], alias: string) {
    if (params.includes('quarter') && quarter) {
      query.andWhere(`${alias}.quarter IN (:...quarters)`, {
        quarters: quarter,
      });
    }

    return query;
  }

  public static whereMonth(query: any, month: number[], params: string[], alias: string) {
    if (params.includes('month') && month) {
      query.andWhere(`${alias}.month IN (:...months)`, {
        months: month,
      });
    }

    return query;
  }

  public static whereStateCode(query: any, stateCode: string[], params: string[], alias: string) {
    if (params.includes('stateCode') && stateCode) {
      query.andWhere(`${alias}.stateCode IN (:...states)`, {
        states: stateCode.map(states => {
          return states.toUpperCase();
        }),
      });
    }

    return query;
  }

  public static whereFacilityId(query: any, facilityId: number[], params: string[], alias: string) {
    if (params.includes('facilityId') && facilityId) {
      query.andWhere(`${alias}.facilityId IN (:...facilityIds)`, {
        facilityIds: facilityId,
      });
    }

    return query;
  }

  public static whereUnitType(query: any, unitType: string[], params: string[], alias: string) {
    if (params.includes('unitType') && unitType) {
      let string = '(';

      for (let i = 0; i < unitType.length; i++) {
        const regex = Regex.commaDelimited(unitType[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${alias}.unitType) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${alias}.unitType) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
    }

    return query;
  }

  public static whereUnitFuel(query: any, unitFuel: string[], params: string[], alias: string) {
    if (params.includes('unitFuelType') && unitFuel) {
      let string = '(';

      for (let i = 0; i < unitFuel.length; i++) {
        const regex = Regex.commaDelimited(unitFuel[i].toUpperCase());

        if (i === 0) {
          string += `(UPPER(${alias}.primaryFuelInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${alias}.primaryFuelInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(${alias}.secondaryFuelInfo) ~* ${regex}) `;
      }

      string += ')';
      query.andWhere(string);
    }

    return query;
  }

  public static whereControlTech(query: any, cntrlTech: string[], params: string[], alias: string) {
    if (params.includes('controlTechnologies') && cntrlTech) {
      let string = '(';

      for (let i = 0; i < cntrlTech.length; i++) {
        const regex = Regex.commaDelimited(
          cntrlTech[i].toUpperCase(),
        );

        if (i === 0) {
          string += `(UPPER(${alias}.so2ControlInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${alias}.so2ControlInfo) ~* ${regex}) `;
        }

        string += `OR (UPPER(${alias}.noxControlInfo) ~* ${regex}) `;
        string += `OR (UPPER(${alias}.pmControlInfo) ~* ${regex}) `;
        string += `OR (UPPER(${alias}.hgControlInfo) ~* ${regex}) `;
      }

      string += ')';
      query.andWhere(string);
    }

    return query;
  }

  public static whereProgramCode(query: any, prgCode: string[], params: string[], alias: string) {
    if (params.includes('programCodeInfo') && prgCode) {
      let string = '(';

      for (let i = 0; i < prgCode.length; i++) {
        const regex = Regex.commaDelimited(
          prgCode[i].toUpperCase(),
        );

        if (i === 0) {
          string += `(UPPER(${alias}.programCodeInfo) ~* ${regex}) `;
        } else {
          string += `OR (UPPER(${alias}.programCodeInfo) ~* ${regex}) `;
        }
      }

      string += ')';
      query.andWhere(string);
    }

    return query;
  }

  public static whereOperatingHoursOnly(query: any, opHrsOnly: boolean, params: string[], alias: string) {
    if (params.includes('operatingHoursOnly') && String(opHrsOnly) === String(true)
    ) {
      query.andWhere(`${alias}.opTime > 0`);
    }

    return query;
  }

  public static createEmissionsQuery(
    query: any,
    dto: any,
    params: string[],
    alias: string,
  ) {
    query = this.whereBeginDate(query, dto.beginDate, params, alias);
    query = this.whereEndDate(query, dto.endDate, params, alias);
    query = this.whereYear(query, dto.year, params, alias);
    query = this.whereQuarter(query, dto.quarter, params, alias);
    query = this.whereMonth(query, dto.month, params, alias);
    query = this.whereStateCode(query, dto.stateCode, params, alias);
    query = this.whereFacilityId(query, dto.facilityId, params, alias);
    query = this.whereUnitType(query, dto.unitType, params, alias);
    query = this.whereUnitFuel(query, dto.unitFuel, params, alias);
    query = this.whereControlTech(query, dto.controlTechnologies, params, alias);
    query = this.whereProgramCode(query, dto.programCodeInfo, params, alias);
    query = this.whereOperatingHoursOnly(query, dto.operatingHoursOnly, params, alias);

    if (dto.page && dto.perPage) {
      query = query.skip((dto.page - 1) * dto.perPage).take(dto.perPage);
    }

    return query;
  }
}
