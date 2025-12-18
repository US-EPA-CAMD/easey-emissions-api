import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection, withMasterConnection } from '@us-epa-camd/easey-common';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewRepository } from './emissions-view.repository';
import { getSelectedView } from '../utils/selected-emission-view';

@Injectable()
export class EmissionsViewService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: EmissionsViewRepository,
  ) {}

  async getAvailableViews(): Promise<EmissionsViewDTO[]> {
    return withSlaveConnection(this.dataSource, async (entityManager: EntityManager) => {
      const results = await entityManager
        .getRepository(this.repository.target)
        .find({
          where: { groupCode: 'EMVIEW' },
          order: { sortOrder: 'ASC' },
        });

      return results.map(e => {
        return {
          code: e.code,
          name: e.displayName,
        };
      });
    });
  }

  async getView(
    viewCode: string,
    req: Request,
    params: EmissionsViewParamsDTO,
  ) {
    const { rptPeriods, counts } = await withSlaveConnection(this.dataSource, async (entityManager: EntityManager) => {
      const rptPeriods = await entityManager.query(
        `SELECT rpt_period_id as id
         FROM camdecmpsmd.reporting_period
         WHERE period_abbreviation = ANY($1);`,
        [params.reportingPeriod],
      );

      const counts = await getSelectedView(
        'COUNTS',
        'camdecmps',
        req,
        params,
        rptPeriods,
        entityManager,
      );

      return { rptPeriods, counts };
    });

    if (viewCode === 'COUNTS') return counts;

    const promises = [];
    rptPeriods.forEach(async (rp: { id: number }) => {
      let rpCounts = counts.filter(c => {
        return c.rptPeriodId === Number(rp.id) && c.dataSetCode == viewCode;
      });

      if (rpCounts && rpCounts.length === 0) {
        promises.push(
          withMasterConnection(this.dataSource, async (entityManager: EntityManager) => {
            await entityManager.query(
              `CALL camdecmps.refresh_emission_view_${viewCode}($1, $2);`,
              [params.monitorPlanId, rp.id],
            );
          })
        );
      }
    });

    if (promises.length > 0) {
      await Promise.all(promises);
    }

    return withSlaveConnection(this.dataSource, async (entityManager: EntityManager) => {
      return getSelectedView(
        viewCode,
        'camdecmps',
        req,
        params,
        rptPeriods,
        entityManager,
      );
    });
  }
}
