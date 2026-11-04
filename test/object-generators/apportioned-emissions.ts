import { faker } from '@faker-js/faker';
import { AnnualApportionedEmissionsAggregationDTO } from '../../src/dto/annual-apportioned-emissions-aggregation.dto';
import { AnnualApportionedEmissionsStateAggregationDTO } from '../../src/dto/annual-apportioned-emissions-state-aggregation.dto';
import { DailyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/daily-apportioned-emissions-facility-aggregation.dto';
import { DailyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/daily-apportioned-emissions-national-aggregation.dto';
import { DailyApportionedEmissionsStateAggregationDTO } from '../../src/dto/daily-apportioned-emissions-state-aggregation.dto';
import { HourlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-facility-aggregation.dto';
import { HourlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-national-aggregation.dto';
import { HourlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/hourly-apportioned-emissions-state-aggregation.dto';
import { MonthlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-facility-aggregation.dto';
import { MonthlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-national-aggregation.dto';
import { MonthlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/monthly-apportioned-emissions-state-aggregation.dto';
import { AnnualApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/annual-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsFacilityAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-facility-aggregation.dto';
import { QuarterlyApportionedEmissionsStateAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-state-aggregation.dto';
import { QuarterlyApportionedEmissionsNationalAggregationDTO } from '../../src/dto/quarterly-apportioned-emissions-national-aggregation.dto';
import { ApplicableApportionedEmissionsAttributesDTO } from 'src/dto/applicable-apportioned-emissions-attributes.dto';

const apportionedEmissionsAggregationDTO = {
  grossLoad: faker.number.int(),
  steamLoad: faker.number.int(),
  so2Mass: faker.number.int(),
  co2Mass: faker.number.int(),
  noxMass: faker.number.int(),
  heatInput: faker.number.int(),
};

const annualApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.number.int(),
};

const dailyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  date: '2019-01-01',
};

const hourlyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  date: '2019-01-01',
  hour: faker.number.int(),
};

const monthlyApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.number.int(),
  month: faker.number.int(),
};

const quarterApportionedEmissionsAggregationDTO = {
  ...apportionedEmissionsAggregationDTO,
  year: faker.number.int(),
  quarter: faker.number.int(),
};

const facilityAggregation = {
  facilityId: faker.number.int(),
  facilityName: faker.string.sample(),
  stateCode: faker.string.sample(),
};

const stateAggregation = {
  stateCode: faker.string.sample(),
};

const viewData = {
  stateCode: faker.string.sample(),
  facilityName: faker.string.sample(),
  facilityId: faker.number.int(),
  unitId: faker.number.int(),
  associatedStacks: faker.string.sample(),
  sumOpTime: faker.number.int(),
  countOpTime: faker.number.int(),
  grossLoad: faker.number.int(),
  steamLoad: faker.number.int(),
  so2Mass: faker.number.int(),
  so2Rate: faker.number.int(),
  co2Mass: faker.number.int(),
  co2Rate: faker.number.int(),
  noxMass: faker.number.int(),
  noxRate: faker.number.int(),
  heatInput: faker.number.int(),
  primaryFuelInfo: faker.string.sample(),
  secondaryFuelInfo: faker.string.sample(),
  unitType: faker.string.sample(),
  so2ControlInfo: faker.string.sample(),
  noxControlInfo: faker.string.sample(),
  pmControlInfo: faker.string.sample(),
  hgControlInfo: faker.string.sample(),
  programCodeInfo: faker.string.sample(),
};

export const genAnnualApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genAnnualApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genAnnualApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: AnnualApportionedEmissionsAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...annualApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genAnnualUnitData = <RepoType>(amount = 1): RepoType[] => {
  const annualUnitData: RepoType[] = [];
  for (let annualValue = 0; annualValue < amount; annualValue++) {
    annualUnitData.push(({
      ...viewData,
      year: faker.number.int(),
    } as unknown) as RepoType);
  }
  return annualUnitData;
};

export const genDailyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genDailyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genDailyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: DailyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...dailyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genDayUnitData = <RepoType>(amount = 1): RepoType[] => {
  const dayUnitData: RepoType[] = [];
  for (let dayValue = 0; dayValue < amount; dayValue++) {
    dayUnitData.push(({
      ...viewData,
      date: faker.date.anytime(),
    } as unknown) as RepoType);
  }
  return dayUnitData;
};

export const genHourlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genHourlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genHourlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: HourlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...hourlyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genHourUnitData = <RepoType>(amount = 1): RepoType[] => {
  const hourUnitData: RepoType[] = [];
  for (let hourValue = 0; hourValue < amount; hourValue++) {
    hourUnitData.push(({
      ...viewData,
      date: faker.date.anytime(),
    } as unknown) as RepoType);
  }
  return hourUnitData;
};

export const genMonthlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genMonthlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genMonthlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: MonthlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...monthlyApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genMonthUnitData = <RepoType>(amount = 1): RepoType[] => {
  const monthUnitData: RepoType[] = [];
  for (let monthValue = 0; monthValue < amount; monthValue++) {
    monthUnitData.push(({
      ...viewData,
      date: faker.date.anytime(),
    } as unknown) as RepoType);
  }
  return monthUnitData;
};

export const genQuarterlyApportionedEmissionsFacilityDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsFacilityAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
      ...facilityAggregation,
    });
  }

  return dtos;
};

export const genQuarterlyApportionedEmissionsStateDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsStateAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
      ...stateAggregation,
    });
  }

  return dtos;
};

export const genQuarterlyApportionedEmissionsNationalDto = (amount = 1) => {
  const dtos: QuarterlyApportionedEmissionsNationalAggregationDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...quarterApportionedEmissionsAggregationDTO,
    });
  }

  return dtos;
};

export const genQuarterUnitData = <RepoType>(amount = 1): RepoType[] => {
  const quarterUnitData: RepoType[] = [];
  for (let quarterValue = 0; quarterValue < amount; quarterValue++) {
    quarterUnitData.push(({
      ...viewData,
      date: faker.date.anytime(),
    } as unknown) as RepoType);
  }
  return quarterUnitData;
};

export const genApplicableApportionedEmissionsAttributesDto = (amount = 1) => {
  const dtos: ApplicableApportionedEmissionsAttributesDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      year: faker.number.int(),
      programCode: faker.string.sample(),
      facilityId: faker.number.int(),
      stateCode: faker.string.sample(),
      unitTypeCode: faker.string.sample(),
      fuelTypeCode: faker.string.sample(),
      controlCode: faker.string.sample(),
    });
  }

  return dtos;
};

export const genHourUnitMatsDataView = <RepoType>(amount = 1): RepoType[] => {
  const hourUnitMatsData: RepoType[] = [];
  for (let hourlyMatsValue = 0; hourlyMatsValue < amount; hourlyMatsValue++) {
    hourUnitMatsData.push(({
      stateCode: faker.string.sample(),
      facilityName: faker.string.sample(),
      facilityId: faker.number.int(),
      unitId: faker.string.sample(),
      date: faker.date.anytime(),
      hour: faker.number.int(),
      opTime: faker.number.int(),
      matsGrossLoad: faker.number.int(),
      matsHeatInput: faker.number.int(),
      hgOutputRate: faker.number.int(),
      hgInputRate: faker.number.int(),
      hgMass: faker.number.int(),
      hgMassMeasureFlg: faker.string.sample(),
      hclOutputRate: faker.number.int(),
      hclInputRate: faker.number.int(),
      hclMass: faker.number.int(),
      hclMassMeasureFlg: faker.string.sample(),
      hfOutputRate: faker.number.int(),
      hfInputRate: faker.number.int(),
      hfMass: faker.number.int(),
      hfMassMeasureFlg: faker.string.sample(),
      associatedStacks: faker.string.sample(),
      steamLoad: faker.number.int(),
      primaryFuelInfo: faker.string.sample(),
      secondaryFuelInfo: faker.string.sample(),
      unitType: faker.string.sample(),
      so2ControlInfo: faker.string.sample(),
      noxControlInfo: faker.string.sample(),
      pmControlInfo: faker.string.sample(),
      hgControlInfo: faker.string.sample(),
    } as unknown) as RepoType);
  }
  return hourUnitMatsData;
};
