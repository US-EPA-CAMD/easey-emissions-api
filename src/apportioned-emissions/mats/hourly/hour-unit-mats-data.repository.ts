import { Request } from 'express';

import {
  Repository,
  EntityRepository,
  SelectQueryBuilder,
  getManager,
  getRepository,
} from 'typeorm';

import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';

import { QueryBuilderHelper } from '../../../utils/query-builder.helper';
import { HourUnitMatsDataView } from '../../../entities/vw-hour-unit-mats-data.entity';
import { HourUnitMatsDataArch } from '../../../entities/hour-unit-mats-data-arch.entity';
import { HourUnitMatsData } from '../../../entities/hour-unit-mats-data.entity';
import { ApplicableMatsApportionedEmissionsAttributesParamsDTO } from '../../../dto/applicable-mats-apportioned-emissions-attributes-params.dto';
import { UnitFact } from '../../../entities/unit-fact.entity';
import { UnitTypeYearDim } from '../../../entities/unit-type-year-dim.entity';
import { FuelYearDim } from '../../../entities/fuel-year-dim.entity';
import { ControlYearDim } from '../../../entities/control-year-dim.entity';
import {
  HourlyMatsApportionedEmissionsParamsDTO,
  PaginatedHourlyMatsApportionedEmissionsParamsDTO,
} from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';

@EntityRepository(HourUnitMatsDataView)
@EntityRepository(HourUnitMatsData)
@EntityRepository(HourUnitMatsDataArch)
export class HourUnitMatsDataRepository extends Repository<
  HourUnitMatsDataView
> {

  async getEmissions(
    req: Request,
    params: PaginatedHourlyMatsApportionedEmissionsParamsDTO,
  ): Promise<HourUnitMatsDataView[]> {
    let totalCount: number;
    let results: HourUnitMatsDataView[];
    const { page, perPage } = params;
    const query = this.buildQuery(params);

    if (page && perPage) {
      [results, totalCount] = await query.getManyAndCount();
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
    } else {
      results = await query.getMany();
    }

    return results;
  }

  private getColumns(isStreamed: boolean): string[] {
    const columns = [
      'humd.stateCode',
      'humd.facilityName',
      'humd.facilityId',
      'humd.unitId',
      'humd.date',
      'humd.hour',
      'humd.opTime',
      'humd.matsGrossLoad',
      'humd.matsHeatInput',
      'humd.hgOutputRate',
      'humd.hgInputRate',
      'humd.hgMass',
      'humd.hgMassMeasureFlg',
      'humd.hclOutputRate',
      'humd.hclInputRate',
      'humd.hclMass',
      'humd.hclMassMeasureFlg',
      'humd.hfOutputRate',
      'humd.hfInputRate',
      'humd.hfMass',
      'humd.hfMassMeasureFlg',
      'humd.associatedStacks',
      'humd.steamLoad',
      'humd.primaryFuelInfo',
      'humd.secondaryFuelInfo',
      'humd.unitType',
      'humd.so2ControlInfo',
      'humd.noxControlInfo',
      'humd.pmControlInfo',
      'humd.hgControlInfo',
    ];

    return columns.map(col => {
      if (isStreamed) {
        return `${col} AS "${col.split('.')[1]}"`;
      } else {
        return col;
      }
    });
  }

  private buildQuery(
    params: HourlyMatsApportionedEmissionsParamsDTO,
    isStreamed = false,
  ): SelectQueryBuilder<HourUnitMatsDataView> {
    let query = getRepository(HourUnitMatsDataView)
      .createQueryBuilder('humd')
      .select(this.getColumns(isStreamed));

    query = QueryBuilderHelper.createEmissionsQuery(
      query,
      params,
      [
        'beginDate',
        'endDate',
        'stateCode',
        'facilityId',
        'unitType',
        'controlTechnologies',
        'unitFuelType',
        'operatingHoursOnly',
      ],
      'humd',
    );

    query
      .orderBy('humd.facilityId')
      .addOrderBy('humd.unitId')
      .addOrderBy('humd.date')
      .addOrderBy('humd.hour');

    return query;
  }

  async getApplicableEmissions(
    params: ApplicableMatsApportionedEmissionsAttributesParamsDTO,
    isArchived: boolean,
    isUnion: boolean,
  ): Promise<any[]> {
    let query;
    const entityManager = getManager();
    const { beginDate, endDate } = params;

    if (isUnion) {
      const curr = await this.applicableQueryBuilderHelper(
        false,
        beginDate,
        endDate,
        true,
      );
      const arch = await this.applicableQueryBuilderHelper(
        true,
        beginDate,
        endDate,
        true,
      );

      query = `${curr.getQuery()} WHERE "humd"."op_date" BETWEEN ($1) AND ($2) UNION ${arch.getQuery()} WHERE "humd"."op_date" BETWEEN ($1) AND ($2)`;
      console.log(query);
      return entityManager.query(query, [beginDate, endDate]);
    } else {
      query = await this.applicableQueryBuilderHelper(
        isArchived,
        beginDate,
        endDate,
        false,
      );
      console.log(query.getQueryAndParameters());
      return query.getRawMany();
    }
  }

  async applicableQueryBuilderHelper(
    isArchived: boolean,
    beginDate: Date,
    endDate: Date,
    isUnion: boolean,
  ): Promise<any> {
    const query = isArchived
      ? getRepository(HourUnitMatsDataArch).createQueryBuilder('humd')
      : getRepository(HourUnitMatsData).createQueryBuilder('humd');

    query
      .select(
        [
          'humd.date',
          'uf.facilityId',
          'uf.stateCode',
          'utyd.unitTypeCode',
          'fyd.fuelTypeCode',
          'cyd.controlCode',
        ].map(col => `${col} AS "${col.split('.')[1]}"`),
      )
      .innerJoin(UnitFact, 'uf', 'humd.year = uf.year AND humd.id = uf.id')
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
        'humd.op_date',
        'uf.fac_id',
        'uf.state',
        'utyd.unit_type',
        'fyd.fuel_code',
        'cyd.control_code',
      ]);

    if (!isUnion) {
      query.andWhere(`humd.date BETWEEN (:beginDate) AND (:endDate)`, {
        beginDate,
        endDate,
      });
    }

    console.log(query.getQueryAndParameters()); 

    return query;
  }

  async lastArchivedDate(): Promise<any> {
    const result = await this.query(
      'SELECT MAX(op_date) AS "date" FROM camddmw_arch.hour_unit_mats_data_a;',
    );
    return result[0].date;
  }
}
