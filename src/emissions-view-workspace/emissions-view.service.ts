import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';

@Injectable()
export class EmissionsViewWorkspaceService {
  constructor(private readonly repository: EmissionsViewWorkspaceRepository) {}

  async getAvailableViews(): Promise<EmissionsViewDTO[]> {
    const results = await this.repository.find({ templateCode: 'EMVIEW' });

    return results.map(e => {
      return {
        code: e.code,
        name: e.displayName,
      };
    });
  }

  async getView(
    viewCode: string,
    req: Request,
    params: EmissionsViewParamsDTO,
  ) {
    const mgr = getManager();
    const schema = 'camdecmpswks';
    const reportingPeriods = params.reportingPeriod;
    const monitorPlanId = params.monitorPlanId;
    const unitIds = params.unitIds ?? [{}];
    const stackPipeIds = params.stackPipeIds ?? [{}];
    const viewCodeUpperCase = viewCode.toUpperCase();
    const templateCode = 'EMVIEW';

    const rptPeriod = await mgr
      .createQueryBuilder()
      .select('rp.id AS id')
      .from('camdecmpsmd.reporting_period', 'rp')
      .where('rp.periodAbbreviation IN (:...reportingPeriods)', {
        reportingPeriods,
      })
      .getRawMany();

    const monLocs = await mgr
      .createQueryBuilder()
      .select('ml.id AS id')
      .from(`${schema}.monitor_location`, 'ml')
      .innerJoin('ml.monitorPlans', 'mp')
      .leftJoin('ml.unit', 'u')
      .leftJoin('ml.stackPipe', 'sp')
      .where('mp.id = :monitorPlanId', { monitorPlanId })
      .andWhere('u.name IN (:...unitIds) OR sp.name IN (:...stackPipeIds)', {
        unitIds,
        stackPipeIds,
      })
      .getRawMany();

    const columns = await mgr
      .createQueryBuilder()
      .select(
        'ds.displayName AS viewName, col.name AS columnName, col.alias AS columnAlias, col.displayName AS columnLabel',
      )
      .from('camdaux.datacolumn', 'col')
      .innerJoin('col.dataTable', 'dt')
      .innerJoin('dt.dataSet', 'ds')
      .where('ds.templateCode = :templateCode', { templateCode })
      .andWhere('ds.code = :viewCodeUpperCase ', { viewCodeUpperCase })
      .orderBy('col.columnOrder')
      .getRawMany();

    let columnList = columns.map(i => `${i.columnname} AS "${i.columnalias}"`);

    const viewData = await mgr.query(
      `
      SELECT ${columnList.join(',')}
      FROM ${schema}.emission_view_${viewCode.toLowerCase()}
      WHERE rpt_period_id = ANY($1) AND mon_loc_id = ANY($2);`,
      [rptPeriod.map(i => i.id), monLocs.map(i => i.id)],
    );

    columnList = columns.map(i =>
      JSON.parse(
        `{ "label": "${i.columnlabel}", "value": "${i.columnalias}" }`,
      ),
    );

    req.res.setHeader('X-Field-Mappings', JSON.stringify(columnList));

    return viewData;
  }
}
