import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ControlYearDim } from '../entities/control-year-dim.entity';
import { FuelYearDim } from '../entities/fuel-year-dim.entity';
import { ProgramYearDim } from '../entities/program-year-dim.entity';
import { UnitFact } from '../entities/unit-fact.entity';
import { UnitTypeYearDim } from '../entities/unit-type-year-dim.entity';

@Injectable()
export class UnitFactRepository extends Repository<UnitFact> {
  constructor(entityManager: EntityManager) {
    super(UnitFact, entityManager);
  }

  async getApplicableApportionedEmissionsAttributes(
    yearArray: number[],
    matsDataOnly = false,
  ): Promise<ProgramYearDim[]> {
    const query = await this.queryBuilderHelper(yearArray, matsDataOnly);
    return query.getRawMany();
  }

  async queryBuilderHelper(
    yearArray: number[],
    matsDataOnly = false,
  ): Promise<any> {
    const columnList = [
      'uf.year',
      'pyd.programCode',
      'uf.facilityId',
      'uf.stateCode',
      'utyd.unitTypeCode',
      'fyd.fuelTypeCode',
      'cyd.controlCode',
    ];

    const query = this.createQueryBuilder('uf')
      .select(
        columnList.map(col => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      )
      .distinctOn(columnList)
      .leftJoin(ProgramYearDim, 'pyd', 'pyd.year = uf.year AND pyd.id = uf.id')
      .leftJoin(
        UnitTypeYearDim,
        'utyd',
        'utyd.year = uf.year AND utyd.id = uf.id',
      )
      .leftJoin(FuelYearDim, 'fyd', 'fyd.year = uf.year AND fyd.id = uf.id')
      .leftJoin(ControlYearDim, 'cyd', 'cyd.year = uf.year AND cyd.id = uf.id');

    if (matsDataOnly) {
      query.where(`pyd.programCode = 'MATS'`);
    } else {
      query.where(`pyd.programCode <> 'MATS'`);
    }

    query.andWhere(`uf.year IN (:...years)`, {
      years: yearArray,
    });

    return query;
  }

  async lastArchivedYear(): Promise<number> {
    const result = await this.query(
      'SELECT MAX(op_year) AS "year" FROM camddmw_arch.annual_unit_data_a;',
    );
    return result[0].year;
  }
}
