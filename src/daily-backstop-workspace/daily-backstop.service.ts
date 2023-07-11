import { Injectable } from "@nestjs/common";
import { ImportIdentifiers } from "../emissions-workspace/emissions.service";

export type DailyBackstopCreate = & {
    reportingPeriodId: number;
    monitoringLocationId: string;
    identifiers: ImportIdentifiers;
};

@Injectable()
export class SummaryValueWorkspaceService {
}
