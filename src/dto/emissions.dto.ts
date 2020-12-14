
import { ListDTO } from './list.dto';

export class EmissionsDTO {
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
  secondaryFuelInfo: ListDTO;
  unitTypeInfo: string;
  so2ControlInfo: ListDTO;
  partControlInfo: ListDTO;
  noxControlInfo: ListDTO;
  hgControlInfo: ListDTO;
}