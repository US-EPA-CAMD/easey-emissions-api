import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { Nsps4tCompliancePeriodImportDTO } from '../dto/nsps4t-compliance-period.dto';
import { randomUUID } from 'crypto';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';

export type Nsps4tCompliancePeriodDataCreate = Nsps4tCompliancePeriodImportDTO & {
  monitoringLocationId: string;
  nsps4tSumId: string;
  reportingPeriodId: number;
  identifiers: ImportIdentifiers;
};

type ImportNsps4tCompliancePeriodDataProperties = {
  data: Nsps4tCompliancePeriodDataCreate;
  repository: Nsps4tCompliancePeriodWorkspaceRepository;
};

export const importNsps4tCompliancePeriodData = async ({
  data,
  repository,
}: ImportNsps4tCompliancePeriodDataProperties): Promise<Nsps4tCompliancePeriod> => {
  return repository.save(
    repository.create({
      id: randomUUID(),
      nsps4tSumId: data.nsps4tSumId,
      beginYear: data.beginYear,
      beginMonth: data.beginMonth,
      endYear: data.endYear,
      endMonth: data.endMonth,
      averageCo2EmissionRate: data.averageCO2EmissionRate,
      co2EmissionRateUomCode: data.co2EmissionRateUnitsOfMeasureCode,
      percentValidOpHours: data.percentValidOpHours,
      violationOfCo2StandardIndicator: data.violationOfCO2StandardIndicator,
      violationOfCo2StandardComment: data.violationOfCo2StandardComment,
      monitoringLocationId: data.monitoringLocationId,
      reportingPeriodId: data.reportingPeriodId,
      userId: data.identifiers?.userId,
      addDate: new Date(),
      updateDate: new Date(),
    }),
  );
};
