import { Injectable } from '@nestjs/common';
import { MatsDerivedHrlyValueDTO } from '../dto/mats-derived-hrly-value.dto';
import { MatsDerivedHrlyValueRepository } from './mats-derived-hrly-value.repository';

@Injectable()
export class MatsDerivedHrlyValueService {
  constructor(private readonly repository: MatsDerivedHrlyValueRepository) {}

  async export(
    monitorLocationIds: string[],
  ): Promise<MatsDerivedHrlyValueDTO[]> {
    return this.repository.export(monitorLocationIds);
  }
}
