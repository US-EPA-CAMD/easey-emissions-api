import { Injectable } from '@nestjs/common';
import {
  importNsps4tAnnualData,
  Nsps4tAnnualDataCreate,
} from '../nsps4t-annual-functions/import-nsps4t-annual-data';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';
import { Nsps4tAnnualDTO } from '../dto/nsps4t-annual.dto';
import { exportNsps4tAnnualData } from '../nsps4t-annual-functions/export-nsps4t-annual-data';

@Injectable()
export class Nsps4tAnnualWorkspaceService {
  constructor(private readonly repository: Nsps4tAnnualWorkspaceRepository) {}

  async export(nsps4tSummaryIds: string[]): Promise<Nsps4tAnnualDTO[]> {
    return exportNsps4tAnnualData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }

  async import(data: Nsps4tAnnualDataCreate): Promise<Nsps4tAnnual> {
    return importNsps4tAnnualData({ data, repository: this.repository });
  }
}
