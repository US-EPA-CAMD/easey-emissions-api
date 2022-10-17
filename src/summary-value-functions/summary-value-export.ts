import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueDTO } from '../dto/summary-value.dto';
import { SummaryValueParamsDto } from '../dto/summary-value-params.dto';

export const exportSupplementarySummaryValuesQuery = async (
  params: SummaryValueParamsDto,
  repository: SummaryValueRepository,
): Promise<SummaryValue[]> => {
  const plantConditons = `plant.oris_code IN (${params.orisCode.join(', ')})`;
  const reportingPeriodConditions = `
    reportingPeriod.calendar_year >= ${params.beginYear} AND
    reportingPeriod.quarter >= ${params.beginQuarter} AND
    reportingPeriod.calendar_year <= ${params.endYear} AND
    reportingPeriod.quarter <= ${params.beginQuarter}
  `;

  const query = repository
    .createQueryBuilder('summaryValue')
    .leftJoinAndSelect('summaryValue.monitorLocation', 'monitorLocation')
    .leftJoin('monitorLocation.monitorPlans', 'monitorPlans')
    .leftJoin('monitorPlans.plant', 'plant', plantConditons)
    .leftJoin(
      'summaryValue.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

  return query.getMany();
};

export const exportSupplementarySummaryValues = async (
  params: SummaryValueParamsDto,
  repository: SummaryValueRepository,
): Promise<SummaryValueDTO[]> => {
  const data = await exportSupplementarySummaryValuesQuery(params, repository);

  return new SummaryValueMap().many(data);
};
