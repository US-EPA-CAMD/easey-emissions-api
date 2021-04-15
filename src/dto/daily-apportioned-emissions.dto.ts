import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class DailyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  opDate: string;
  sumOpTime: number;
  countOpTime: number;
}
