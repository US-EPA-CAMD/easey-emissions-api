import { Injectable } from '@nestjs/common';
import { LongTermFuelFlowDTO, LongTermFuelFlowImportDTO } from '../dto/long-term-fuel-flow.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';
import { DeleteResult, FindConditions } from 'typeorm';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
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

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<LongTermFuelFlowDTO[]> {
    const result = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );
    return this.map.many(result);
  }

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
