import { Injectable } from '@nestjs/common';
import {
  importNsps4tAnnualData,
  Nsps4tAnnualDataCreate,
} from '../nsps4t-annual-functions/import-nsps4t-annual-data';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';

@Injectable()
export class Nsps4tAnnualWorkspaceService {
  constructor(private readonly repository: Nsps4tAnnualWorkspaceRepository) {}

  async import(data: Nsps4tAnnualDataCreate): Promise<Nsps4tAnnual> {
    return importNsps4tAnnualData({ data, repository: this.repository });
  }
}
