import { ApportionedEmissionsDTO } from './apportioned-emissions.dto';

export class AnnualApportionedEmissionsDTO extends ApportionedEmissionsDTO {
  opYear: number;
  sumOpTime: number;
  countOpTime: number;
}
