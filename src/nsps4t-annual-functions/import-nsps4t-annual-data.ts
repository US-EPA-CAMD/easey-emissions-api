import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualImportDTO } from '../dto/nsps4t-annual.dto';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';

export type Nsps4tAnnualDataCreate = Nsps4tAnnualImportDTO & {
  monitoringLocationId: string;
  nsps4tSumId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

type ImportNsps4tAnnualDataProperties = {
  data: Nsps4tAnnualDataCreate;
  repository: Nsps4tAnnualWorkspaceRepository;
};

export const importNsps4tAnnualData = async ({
  data,
  repository,
}: ImportNsps4tAnnualDataProperties): Promise<Nsps4tAnnual> => {
  return repository.save(
    repository.create({
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
