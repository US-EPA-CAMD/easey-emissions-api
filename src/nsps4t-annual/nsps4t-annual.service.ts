import { Injectable } from '@nestjs/common';
import { Nsps4tAnnualRepository } from './nsps4t-annual.repository';
import { exportNsps4tAnnualData } from '../nsps4t-annual-functions/export-nsps4t-annual-data';
import { Nsps4tAnnualDTO } from '../dto/nsps4t-annual.dto';

@Injectable()
export class Nsps4tAnnualService {
  constructor(private readonly repository: Nsps4tAnnualRepository) {}

  async export(nsps4tSummaryIds: string[]): Promise<Nsps4tAnnualDTO[]> {
    return exportNsps4tAnnualData({
      nsps4tSummaryIds,
      repository: this.repository,
    });
  }
}
