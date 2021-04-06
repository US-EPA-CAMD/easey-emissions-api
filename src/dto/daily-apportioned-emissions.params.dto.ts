import { ApportionedEmissionsParamsDTO } from './apportioned-emissions.params.dto';
import { BeginDate, EndDate } from '../utils/validator.const';

export class DailyApportionedEmissionsParamsDTO extends ApportionedEmissionsParamsDTO {
  @BeginDate()
  beginDate: Date;

  @EndDate()
  endDate: Date;
}
