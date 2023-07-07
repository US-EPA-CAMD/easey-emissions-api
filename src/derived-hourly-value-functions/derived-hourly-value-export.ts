import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value-params.dto';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import { DerivedHourlyValueDTO } from '../dto/derived-hourly-value.dto';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { hasArrayValues } from '../utils/utils';

export const exportSupplementaryDerivedHourlyValuesQuery = async (
  params: DerivedHourlyValueParamsDto,
  repository: DerivedHourlyValueRepository,
): Promise<DerivedHrlyValue[]> => {
  const reportingPeriodConditions = `reportingPeriod.beginDate BETWEEN '${params.beginDate}' AND '${params.endDate}'`;

  let query = repository
    .createQueryBuilder('derivedHourly')
    .innerJoinAndSelect('derivedHourly.monitorLocation', 'monitorLocation')
    .innerJoinAndSelect('derivedHourly.monitorFormula', 'monitorFormula')
    .innerJoinAndSelect('derivedHourly.monitorSystem', 'monitorSystem')
    .innerJoin(
      'derivedHourly.reportingPeriod',
      'reportingPeriod',
      reportingPeriodConditions,
    );

  if (hasArrayValues(params.orisCode)) {
    const plantConditions = `plant.orisCode IN (${params.orisCode.join(
      ', ',
    )}) AND plant.orisCode NOTNULL`;

    query = query
      .innerJoin('monitorLocation.monitorPlans', 'monitorPlans')
      .innerJoin('monitorPlans.plant', 'plant', plantConditions);
  }

  if (hasArrayValues(params.locationName)) {
    const locationStrings = params.locationName
      ?.map(location => `'${location}'`)
      .join(', ');

    const stackPipeCondition = `stackPipe.stack_name IN (${locationStrings})`;
    const unitCondition = `unit.unitid IN (${locationStrings})`;

    query = query
      .leftJoinAndSelect(
        'monitorLocation.stackPipe',
        'stackPipe',
        stackPipeCondition,
      )
      .leftJoinAndSelect('monitorLocation.unit', 'unit', unitCondition);
  }

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
