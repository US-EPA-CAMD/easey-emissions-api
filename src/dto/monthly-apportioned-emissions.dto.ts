import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class MonthlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  opYear: number;
  opMonth: number;
  sumOpTime: number;
  countOpTime: number;
}
