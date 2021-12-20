export class EmissionsSubmissionsProgressDTO {
    beginDate: Date;
    endDate: Date;
    calendarYear: number;
    quarter: number;
    submittedPercentage: number;
    submittedCount: number;
    remainingCount: number;
    totalExpectedCount: number;
    gdmUsedPercentage: number;
    gdmUsedCount: number;
    gdmRemainingCount: number;
}