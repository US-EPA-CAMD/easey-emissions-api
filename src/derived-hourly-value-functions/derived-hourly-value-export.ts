import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value-params.dto';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { quarterFromMonth } from '../utils/util-modules/date-utils';
import { DerivedHourlyValueDTO } from '../dto/derived-hourly-value.dto';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';

export const exportSupplementaryDerivedHourlyValuesQuery = async (
  params: DerivedHourlyValueParamsDto,
  repository: DerivedHourlyValueRepository,
): Promise<DerivedHrlyValue[]> => {
  const beginYear = params.beginDate.getFullYear();
  const beginQuarter = quarterFromMonth(params.beginDate.getMonth());
  const endYear = params.endDate.getFullYear();
  const endQuarter = quarterFromMonth(params.endDate.getMonth());

  const plantConditions = `
    plant.oris_code IN (${params.orisCode.join(', ')}) 
    AND plant.oris_code NOTNULL
  `;
  const reportingPeriodConditions = `
    reportingPeriod.calendar >= ${beginYear} AND
    reportingPeriod.quarter >= ${beginQuarter} AND
    reportingPeriod.calendar <= ${endYear} AND
    reportingPeriod.quarter <= ${endQuarter}
  `;

  const query = repository
    .createQueryBuilder('derivedHourly')
    .innerJoinAndSelect('derivedHourly.monitorLocation', 'monitorLocation')
    .innerJoin('monitorLocation.monitorPlans', 'monitorPlans')
    .innerJoin('monitorPlans.plant', 'plant', plantConditions)
    .innerJoin(
      'derivedHourly.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

  return query.getMany();
};

export const exportSupplementaryDerivedHourlyValues = async (
  params: DerivedHourlyValueParamsDto,
  repository: DerivedHourlyValueRepository,
): Promise<DerivedHourlyValueDTO[]> => {
  const data = await exportSupplementaryDerivedHourlyValuesQuery(
    params,
    repository,
  );

  return new DerivedHourlyValueMap().many(data);
};
