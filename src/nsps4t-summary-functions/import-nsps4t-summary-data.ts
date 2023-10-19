import { Nsps4tSummaryImportDTO } from '../dto/nsps4t-summary.dto';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { Nsps4tSummary } from '../entities/workspace/nsps4t-summary.entity';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';

export type Nsps4tSummaryDataCreate = Nsps4tSummaryImportDTO & {
  monitoringLocationId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

type ImportNsps4tSummaryDataProperties = {
  data: Nsps4tSummaryDataCreate;
  repository: Nsps4tSummaryWorkspaceRepository;
};

export const importNsps4tSummaryData = async ({
  data,
  repository,
}: ImportNsps4tSummaryDataProperties): Promise<Nsps4tSummary> => {
  return repository.save(
    repository.create({
      id: randomUUID(),
      co2EmissionStandardCode: data.co2EmissionStandardCode,
      modusValue: data.modusValue,
      modusUomCode: data.modusUnitsOfMeasureCode,
      electricalLoadCode: data.electricalLoadCode,
      noCompliancePeriodEndedIndicator: data.noCompliancePeriodEndedIndicator,
      noCompliancePeriodEndedComment: data.noCompliancePeriodEndedComment,
      monitoringLocationId: data.monitoringLocationId,
      reportingPeriodId: data.reportingPeriodId,
      userId: data.identifiers?.userId,
      addDate: new Date(),
      updateDate: new Date(),
    }),
  );
};
