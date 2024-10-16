import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { EmissionsViewDTO } from '../dto/emissions-view.dto';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { getSelectedView } from '../utils/selected-emission-view';

@Injectable()
export class EmissionsViewWorkspaceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: EmissionsViewWorkspaceRepository,
  ) {}

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
    const rptPeriods = await this.repository.query(
      `
      SELECT rpt_period_id as id
      FROM camdecmpsmd.reporting_period
      WHERE period_abbreviation = ANY($1);`,
      [params.reportingPeriod],
    );
    return getSelectedView(
      viewCode,
      'camdecmpswks',
      req,
      params,
      rptPeriods,
      this.entityManager,
    );
  }
}
