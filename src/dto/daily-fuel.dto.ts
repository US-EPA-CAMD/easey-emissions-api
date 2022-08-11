export class DailyFuelBaseDTO {
  fuelCode: string;
  dailyFuelFeed?: number;
  carbonContentUsed: number;
  fuelCarbonBurned?: number;
}

export class DailyFuelRecordDTO extends DailyFuelBaseDTO {
  id: string;
  dailyEmissionId: string;
  calcFuelCarbonBurned?: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class DailyFuelImportDTO extends DailyFuelBaseDTO {}

export class DailyFuelDTO extends DailyFuelRecordDTO {}
