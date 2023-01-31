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
    return getSelectedView(viewCode, 'camdecmps', req, params);
  }
}
