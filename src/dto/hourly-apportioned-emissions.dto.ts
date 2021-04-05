import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';
export class HourlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  opDate: string;
  opHour: number;
  opTime: number;
  so2MassMeasureFlg: string;
  so2RateMeasureFlg: string;
  noxMassMeasureFlg: string;
  noxRateMeasureFlg: string;
  co2MassMeasureFlg: string;
  co2RateMeasureFlg: string;
}
