import { Injectable } from '@nestjs/common';
import { LongTermFuelFlowDTO, LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { DeleteResult, FindConditions } from 'typeorm';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { randomUUID } from 'crypto';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';

export type LongTermFuelFlowCreate = LongTermFuelFlowImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class LongTermFuelFlowWorkspaceService {
  constructor(
    private readonly repository: LongTermFuelFlowWorkspaceRepository,
    private readonly map: LongTermFuelFlowMap
  ){}

  async delete(
    criteria: FindConditions<LongTermFuelFlow>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export() {}

  async import(params: LongTermFuelFlowCreate): Promise<LongTermFuelFlowDTO> {
    await this.delete({monitoringLocationId: params.monitoringLocationId, reportingPeriodId: params.reportingPeriodId})

    const createObj = {
      ...params,
      id: randomUUID(),
      monitoringSystemId: params.identifiers?.monitoringSystems[params.monitoringSystemId],
      addDate: new Date(),
      updateDate: new Date(),
      userId: params.identifiers?.userId,
    };

    const ltff = await this.repository.save(
      this.repository.create(createObj),
    );

    return this.map.one(ltff);
  }
}
