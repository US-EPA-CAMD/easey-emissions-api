
export class HourlyApportionedEmissionsDTO {
  state: string;
  facilityName: string;
  orisCode: number;
  unitId: string;
  opDate: Date;
  opHour: number;
  opTime: number;
  gLoad: number;
  sLoad: number;
  so2Mass: number;
  so2MassMeasureFlg: string;
  so2Rate: number;
  sorRateMeasureFlg: string;
  noxMass: number;
  noxMassMeasureFlg: string;
  noxRate: number;
  noxRateMeasureFlg: string;
  co2Mass: number;
  co2MassMeasureFlg: string;
  co2Rate: number;
  corRateMeasureFlg: string;
  heatInput: number;
  primaryFuelInfo: string;
  secondaryFuelInfo: string;
  unitTypeInfo: string;
  so2ControlInfo: string;
  partControlInfo: string;
  noxControlInfo: string;
  hgControlInfo: string;
}