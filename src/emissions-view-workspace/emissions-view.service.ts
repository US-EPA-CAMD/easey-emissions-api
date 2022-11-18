import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { getSelectedView } from '../utils/selected-emission-view';

@Injectable()
export class EmissionsViewWorkspaceService {
  constructor(private readonly repository: EmissionsViewWorkspaceRepository) {}

  async getView(
    viewCode: string,
    req: Request,
    params: EmissionsViewParamsDTO,
  ) {
    return getSelectedView(viewCode, 'camdecmpswks', req, params);
  }
}
