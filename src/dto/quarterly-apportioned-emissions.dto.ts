import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class QuarterlyApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  opYear: number;
  opQuarter: number;
  sumOpTime: number;
  countOpTime: number;
}
