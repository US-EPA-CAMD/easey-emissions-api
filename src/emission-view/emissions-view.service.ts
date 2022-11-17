import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewRepository } from './emissions-view.repository';
import { getSelectedView } from '../utils/selected-emission-view';
import { EmissionsViewDTO } from '../dto/emissions-view.dto';

@Injectable()
export class EmissionsViewService {
  constructor(private readonly repository: EmissionsViewRepository) {}

  async getAvailableViews(): Promise<EmissionsViewDTO[]> {
    const results = await this.repository.find({
      where: { templateCode: 'EMVIEW' },
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
