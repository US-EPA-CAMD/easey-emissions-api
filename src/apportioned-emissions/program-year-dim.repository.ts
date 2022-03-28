import { Repository, EntityRepository, getManager } from 'typeorm';

import { ProgramYearDim } from '../entities/program-year-dim.entity';
import { AnnualUnitData } from '../entities/annual-unit-data.entity';
import { UnitFact } from '../entities/unit-fact.entity';
import { UnitTypeYearDim } from '../entities/unit-type-year-dim.entity';
import { FuelYearDim } from '../entities/fuel-year-dim.entity';
import { ControlYearDim } from '../entities/control-year-dim.entity';
import { AnnualUnitDataArch } from '../entities/annual-unit-data-a.entity';
import { ApplicableApportionedEmissionsAttributesParamsDTO } from '../dto/applicable-apportioned-emissions-attributes.params.dto';

@EntityRepository(ProgramYearDim)
export class ProgramYearDimRepository extends Repository<ProgramYearDim> {
  async getApplicableApportionedEmissionsAttributes(
    applicableApportionedEmissionsParamsDTO: ApplicableApportionedEmissionsAttributesParamsDTO,
    isArchived: boolean,
    isUnion: boolean,
  ): Promise<ProgramYearDim[]> {
    const entityManager = getManager();
    const yearArray = applicableApportionedEmissionsParamsDTO.year;

    if (isUnion) {
      const curr = await this.queryBuilderHelper(false, yearArray, true);
      const arch = await this.queryBuilderHelper(true, yearArray, true);

      return entityManager.query(
        `${curr.getQuery()} WHERE "pyd"."op_year" = ANY($1) UNION ${arch.getQuery()} WHERE "pyd"."op_year" = ANY($1)`,
        [yearArray],
      );
    } else {
      const query = await this.queryBuilderHelper(isArchived, yearArray, false);
      return query.getRawMany();
    }
  }

  async queryBuilderHelper(
    isArchived: boolean,
    yearArray: number[],
    isUnion: boolean,
  ): Promise<any> {
    const query = this.createQueryBuilder('pyd')
      .select(
        [
          'pyd.year',
          'pyd.programCode',
          'uf.facilityId',
          'uf.stateCode',
          'utyd.unitTypeCode',
          'fyd.fuelTypeCode',
          'cyd.controlCode',
        ].map(col => {
          return `${col} AS "${col.split('.')[1]}"`;
        }),
      )
      .innerJoin(
        isArchived ? AnnualUnitDataArch : AnnualUnitData,
        'aud',
        'pyd.year = aud.year AND pyd.id = aud.id',
      )
      .innerJoin(UnitFact, 'uf', 'aud.year = uf.year AND aud.id = uf.id')
      .innerJoin(
        UnitTypeYearDim,
        'utyd',
        'uf.year = utyd.year AND uf.id = utyd.id',
      )
      .innerJoin(
        FuelYearDim,
        'fyd',
        'utyd.year = fyd.year AND utyd.id = fyd.id',
      )
      .innerJoin(
        ControlYearDim,
        'cyd',
        'fyd.year = cyd.year AND fyd.id = cyd.id',
      )
      .distinctOn([
        'pyd.op_year',
        'pyd.prg_code',
        'uf.fac_id',
        'uf.stateCode',
        'utyd.unit_type',
        'fyd.fuel_code',
        'cyd.control_code',
      ]);

    if (!isUnion) {
      query.andWhere(`pyd.year IN (:...years)`, {
        years: yearArray,
      });
    }
    return query;
  }
  async lastArchivedYear(): Promise<number> {
    const result = await this.query(
      'SELECT MAX(op_year) AS "year" FROM camddmw_arch.hour_unit_data_a;',
    );
    return result[0].year;
  }
}
