import { Request } from 'express';
import { getManager } from 'typeorm';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';

export async function getSelectedView(
  viewCode: string,
  schema: string,
  req: Request,
  params: EmissionsViewParamsDTO,
  rptPeriods: any[],
) {
  const mgr = getManager();
  const groupCode = 'EMVIEW';
  const unitIds = params.unitIds ?? [{}];
  const monitorPlanId = params.monitorPlanId;
  const stackPipeIds = params.stackPipeIds ?? [{}];
  const viewCodeUpperCase = viewCode.toUpperCase();

  const monLocs = await mgr.createQueryBuilder()
    .select('ml.id AS id')
    .from(`${schema}.monitor_location`, 'ml')
    .innerJoin('ml.monitorPlans', 'mp')
    .leftJoin('ml.unit', 'u')
    .leftJoin('ml.stackPipe', 'sp')
    .where('mp.id = :monitorPlanId', { monitorPlanId })
    .andWhere('u.name = ANY(:unitIds) OR sp.name = ANY(:stackPipeIds)', {
      unitIds,
      stackPipeIds,
    })
    .getRawMany();

  const columns = await mgr.createQueryBuilder()
    .select(
      'ds.displayName AS viewName, col.name AS columnName, col.alias AS columnAlias, col.displayName AS columnLabel',
    )
    .from('camdaux.datacolumn', 'col')
    .innerJoin('col.dataTable', 'dt')
    .innerJoin('dt.dataSet', 'ds')
    .where('ds.groupCode = :groupCode', { groupCode })
    .andWhere('ds.code = :viewCodeUpperCase ', { viewCodeUpperCase })
    .orderBy('col.columnOrder')
    .getRawMany();

  let columnList = columns.map(i => `vw.${i.columnname} AS "${i.columnalias}"`);
  
  let viewData = await mgr.createQueryBuilder()
  .select(`${columnList.join(',')}, rp.calendar_year as rptYear, rp.quarter as rptQuarter`)
  .from(`${schema}.emission_view_${viewCode.toLowerCase()}`, 'vw')
  .innerJoin(ReportingPeriod, 'rp', 'vw.rpt_period_id=rp.id')
  .where('mon_plan_id = :monitorPlanId', { monitorPlanId })
  .andWhere('mon_loc_id IN (:...locations)', { locations: monLocs.map(i => i.id) })
  .andWhere('vw.rpt_period_id IN (:...reportPeriods)', { reportPeriods: rptPeriods.map(i => i.id) })
  .getRawMany();
  
  viewData = viewData.map(item => {
    const props = Object.entries(item)
      .map(([key, val]) => {
        if (val !== null && val !== undefined) {
          if (typeof val === 'object') {
            return `"${key}": "${(val as Date).toLocaleDateString()}"`;
          } else if (typeof val === 'string' && isNaN(Number(val))) {
            return `"${key}": "${val}"`;
          } else {
            return `"${key}": ${Number(val)}`;
          }
        }
        return `"${key}": null`;
      })
      .join(',');
    return JSON.parse(`{ ${props} }`);
  });

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
  const monitorPlanId = params.monitorPlanId.trim();
  const facility = await mgr
    .createQueryBuilder()
    .select('p.name AS name')
    .from('camdecmps.monitor_plan', 'mp')
    .innerJoin('mp.plant', 'p')
    .where('mp.id = :monitorPlanId', { monitorPlanId })
    .getRawOne();

  const unitIds = params.unitIds ? ` ${params.unitIds}` : '';
  const stackPipeIds = params.stackPipeIds ? ` ${params.stackPipeIds}` : '';
  let name = `${facility?.name}${unitIds}${stackPipeIds} ${params.reportingPeriod
    } ${viewCode?.toUpperCase().trim()} emissions`;
  const nameSplit = name.split('|');
  const formatedName = nameSplit.join(',');
  return formatedName;
}
