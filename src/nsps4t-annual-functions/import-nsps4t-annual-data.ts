import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualImportDTO } from '../dto/nsps4t-annual.dto';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';
import { EntityManager } from 'typeorm';
import { withTransaction } from '../utils/utils';

export type Nsps4tAnnualDataCreate = Nsps4tAnnualImportDTO & {
  monitoringLocationId: string;
  nsps4tSumId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

type ImportNsps4tAnnualDataProperties = {
  data: Nsps4tAnnualDataCreate;
  repository: Nsps4tAnnualWorkspaceRepository;
  trx?: EntityManager;
};

export const importNsps4tAnnualData = async ({
  data,
  repository,
  trx,
}: ImportNsps4tAnnualDataProperties): Promise<Nsps4tAnnual> => {
  const transactionalRepository = withTransaction(repository, trx);
  return transactionalRepository.save(
    transactionalRepository.create({
      id: randomUUID(),
      nsps4tSumId: data.nsps4tSumId,
      annualEnergySold: data.annualEnergySold,
      annualEnergySoldTypeCode: data.annualEnergySoldTypeCode,
      annualPotentialElectricOutput: data.annualPotentialElectricOutput,
      monitoringLocationId: data.monitoringLocationId,
      reportingPeriodId: data.reportingPeriodId,
      userId: data.identifiers?.userId,
      addDate: new Date(),
      updateDate: new Date(),
    }),
  );
};
