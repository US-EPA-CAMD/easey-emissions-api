import { getManager } from 'typeorm';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { Request } from 'express';
export async function getSelectedView(
  viewCode: string,
  schema: string,
  req: Request,
  params: EmissionsViewParamsDTO,
) {
  const mgr = getManager();
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
    JSON.parse(`{ "label": "${i.columnlabel}", "value": "${i.columnalias}" }`),
  );

  req.res.setHeader('X-Field-Mappings', JSON.stringify(columnList));

  return viewData;
}

export async function getFileName(
  viewCode: string,
  params: EmissionsViewParamsDTO,
) {
  const mgr = getManager();
  const monitorPlanId = params.monitorPlanId;
  const facility = await mgr
    .createQueryBuilder()
    .select('p.name AS name')
    .from('camdecmps.monitor_plan', 'mp')
    .innerJoin('mp.plant', 'p')
    .where('mp.id = :monitorPlanId', { monitorPlanId })
    .getRawOne();

  const unitIds = params.unitIds ? ` ${params.unitIds}` : '';
  const stackPipeIds = params.stackPipeIds ? ` ${params.stackPipeIds}` : '';
  let name = `${facility?.name}${unitIds}${stackPipeIds} ${
    params.reportingPeriod
  } ${viewCode?.toUpperCase()} emissions`;
  const nameSplit = name.split('|');
  const formatedName = nameSplit.join(',');
  return formatedName;
}
