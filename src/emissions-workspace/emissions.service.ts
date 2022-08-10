import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly configService: ConfigService,
  ) {}

  async export(
    monPlanId: string,
    year: number,
    quarter: number
  ): Promise<EmissionsDTO> {
    const result = await this.repository.export(monPlanId, year, quarter);
    return this.map.one(result);
  }
}