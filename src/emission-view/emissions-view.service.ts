import { Request } from 'express';
import { Injectable } from '@nestjs/common';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewRepository } from './emissions-view.repository';
import { getSelectedView } from '../utils/selected-emission-view';

@Injectable()
export class EmissionsViewService {
  constructor(private readonly repository: EmissionsViewRepository) {}

  async getAvailableViews(): Promise<EmissionsViewDTO[]> {
    const results = await this.repository.find({
      where: { groupCode: 'EMVIEW' },
      order: { sortOrder: 'ASC' },
    });

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
    const rptPeriods = await this.repository.query(`
      SELECT rpt_period_id as id
      FROM camdecmpsmd.reporting_period
      WHERE period_abbreviation = ANY($1);`
      , [params.reportingPeriod]
    );

    const counts = await getSelectedView('COUNTS', 'camdecmps', req, params, rptPeriods);

    const refreshAndRetrieve = async (rp: { id: number }) => {
      let rpCounts = counts.filter(c => c.rptPeriodId === Number(rp.id));
      if (rpCounts && rpCounts.length === 0) {
        await this.repository.query(`
          CALL camdecmps.refresh_emission_view_${viewCode}($1, $2);`
          , [params.monitorPlanId, rp.id]
        );
      }
    }

    const promises = [];
    rptPeriods.forEach(async (rp: { id: number }) => {
      promises.push(refreshAndRetrieve(rp));
    });

    await Promise.all(promises);
    
    return getSelectedView(viewCode, 'camdecmps', req, params, rptPeriods);
  }
}
