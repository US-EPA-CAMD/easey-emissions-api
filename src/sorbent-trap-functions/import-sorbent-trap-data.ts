import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { randomUUID } from 'crypto';
import { SorbentTrapImportDTO } from '../dto/sorbent-trap.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

export type SorbentTrapWorkspaceCreate = SorbentTrapImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

type ImportSorbentTrapDataProperties = {
  data: SorbentTrapWorkspaceCreate;
  repository: SorbentTrapWorkspaceRepository;
};

export const importSorbentTrapData = async ({
  data,
  repository,
}: ImportSorbentTrapDataProperties) => {
  const sorbentTrap = repository.create({
    id: randomUUID(),
    monitoringLocationId: data.monitoringLocationId,
    reportingPeriodId: data.reportingPeriodId,
    beginDate: data.beginDate,
    beginHour: data.beginHour,
    endDate: data.endDate,
    endHour: data.endHour,
    monitoringSystemId:
      data.identifiers?.monitoringSystems?.[data.monitoringSystemId],
    pairedTrapAgreement: data.pairedTrapAgreement,
    absoluteDifferenceIndicator: data.absoluteDifferenceIndicator,
    modcCode: data.modcCode,
    hgSystemConcentration: data.hgSystemConcentration,
    userId: data.identifiers?.userId,
    apsCode: data.apsCode,
    rataIndicator: data.rataIndicator,
    addDate: new Date(),
    updateDate: new Date(),
  });

  return repository.save(sorbentTrap);
};
