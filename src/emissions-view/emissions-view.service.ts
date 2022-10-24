import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewRepository } from './emissions-view.repository';

@Injectable()
export class EmissionsViewService {
  constructor(private readonly repository: EmissionsViewRepository) {}

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

    const rptPeriod = await mgr.query(
      `
      SELECT rpt_period_id AS "id"
      FROM camdecmpsmd.reporting_period
      WHERE calendar_year = ANY($1) AND quarter = ANY($2);`,
      [params.year, params.quarter],
    );

    const monLocs = await mgr.query(
      `
      SELECT ml.mon_loc_id AS "id"
      FROM ${schema}.monitor_location ml
      JOIN ${schema}.monitor_plan_location mpl USING(mon_loc_id)
      LEFT JOIN camd.unit u USING(unit_id)
      LEFT JOIN ${schema}.stack_pipe sp USING(stack_pipe_id)
      WHERE mpl.mon_plan_id = $1 AND (u.unitid = ANY($2) OR sp.stack_name = ANY($3));`,
      [params.monitorPlanId, params.unitIds, params.stackPipeIds],
    );

    const columns = await mgr.query(
      `
      SELECT
        ds.display_name AS "viewName",
        ds.no_results_msg AS "noResultsMsg",
        col.name AS "columnName",
        col.alias AS "columnAlias",
        col.display_name AS "columnLabel"
      FROM camdaux.datacolumn col
      JOIN camdaux.datatable dt USING(datatable_id)
      JOIN camdaux.dataset ds USING(dataset_cd)
      WHERE ds.template_cd = $1
      AND ds.dataset_cd = $2
      ORDER BY col.column_order`,
      ['EMVIEW', viewCode.toUpperCase()],
    );

    let columnList = columns.map(i => `${i.columnName} AS "${i.columnAlias}"`);

    const viewData = await mgr.query(
      `
      SELECT ${columnList.join(',')}
      FROM ${schema}.emission_view_${viewCode.toLowerCase()}
      WHERE rpt_period_id = ANY($1) AND mon_loc_id = ANY($2);`,
      [rptPeriod.map(i => i.id), monLocs.map(i => i.id)],
    );

    columnList = columns.map(i =>
      JSON.parse(
        `{ "label": "${i.columnLabel}", "value": "${i.columnAlias}" }`,
      ),
    );

    req.res.setHeader('X-Field-Mappings', JSON.stringify(columnList));

    return viewData;
  }
}
