import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

const hourly = [];
const hourlyFacilityAggregation = [];
const hourlyStateAggregation = [];
const hourlyNationalAggregation = [];
const daily = [];
const dailyFacilityAggregation = [];
const dailyStateAggregation = [];
const dailyNationalAggregation = [];
const monthly = [];
const monthlyFacilityAggregation = [];
const monthlyStateAggregation = [];
const monthlyNationalAggregation = [];
const quarterly = [];
const quarterlyFacilityAggregation = [];
const quarterlyStateAggregation = [];
const quarterlyNationalAggregation = [];
const annual = [];
const annualFacilityAggregation = [];
const ozoneFacilityAggregation = [];
const annualStateAggregation = [];
const annualNationalAggregation = [];
const hourlyMats = [];
const excludableHourlyEmissionsColumns = [];
const excludableHourlyMatsEmissionsColumns = [];
const excludableOtherEmissionsColumns = [];

const commonCharacteristics = [
  { ...propertyMetadata.stateCode.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
  { ...propertyMetadata.unitId.fieldLabels },
];

const commonEmissions = [
  { ...propertyMetadata.countOpTime.fieldLabels },
  { ...propertyMetadata.sumOpTime.fieldLabels },
  { ...propertyMetadata.grossLoad.fieldLabels },
  { ...propertyMetadata.steamLoad.fieldLabels },
  { ...propertyMetadata.so2Mass.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.noxMass.fieldLabels },
  { ...propertyMetadata.noxRate.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
];

const unitCharacteristics = [
  { ...propertyMetadata.primaryFuelInfo.fieldLabels },
  { ...propertyMetadata.secondaryFuelInfo.fieldLabels },
  { ...propertyMetadata.unitType.fieldLabels },
];

const excludableControlInfoCharacteristics = [
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
];

const controlInfoCharacteristics = [
  ...excludableControlInfoCharacteristics,
  { ...propertyMetadata.programCodeInfo.fieldLabels },
];

const hourlyCharacteristics = [
  { ...propertyMetadata.date.fieldLabels },
  { ...propertyMetadata.hour.fieldLabels },
  { ...propertyMetadata.opTime.fieldLabels },
];

const aggregationData = [
  { ...propertyMetadata.grossLoad.fieldLabels },
  { ...propertyMetadata.steamLoad.fieldLabels },
  { ...propertyMetadata.so2Mass.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.noxMass.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
];

const facilityAggregationData = [
  { ...propertyMetadata.stateCode.fieldLabels },
  { ...propertyMetadata.facilityName.fieldLabels },
  { ...propertyMetadata.facilityId.fieldLabels },
];

const hourlyAggregationData = [
  { ...propertyMetadata.date.fieldLabels },
  { ...propertyMetadata.hour.fieldLabels },
  { ...propertyMetadata.grossLoadHourly.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  { ...propertyMetadata.so2MassHourly.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.noxMassHourly.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
];

const dailyAggregationData = [
  { ...propertyMetadata.date.fieldLabels },
  ...aggregationData,
];

const monthlyAggregationData = [
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.month.fieldLabels },
  ...aggregationData,
];

const quarterlyAggregationData = [
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.quarter.fieldLabels },
  ...aggregationData,
];

const annualAggregationData = [
  { ...propertyMetadata.year.fieldLabels },
  ...aggregationData,
];

const ozoneAggregationData = [
  { ...propertyMetadata.year.fieldLabels },
  ...aggregationData,
];

hourly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  ...hourlyCharacteristics,
  { ...propertyMetadata.grossLoadHourly.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  { ...propertyMetadata.so2MassHourly.fieldLabels },
  { ...propertyMetadata.so2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.so2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.co2Mass.fieldLabels },
  { ...propertyMetadata.co2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.co2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.noxMassHourly.fieldLabels },
  { ...propertyMetadata.noxMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.noxRate.fieldLabels },
  { ...propertyMetadata.noxRateMeasureFlg.fieldLabels },
  { ...propertyMetadata.heatInput.fieldLabels },
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);

hourlyFacilityAggregation.push(
  ...facilityAggregationData,
  ...hourlyAggregationData,
);

hourlyStateAggregation.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  ...hourlyAggregationData,
);

hourlyNationalAggregation.push(...hourlyAggregationData);

daily.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.date.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);

dailyFacilityAggregation.push(
  ...facilityAggregationData,
  ...dailyAggregationData,
);

dailyStateAggregation.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  ...dailyAggregationData,
);

dailyNationalAggregation.push(...dailyAggregationData);

monthly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.month.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);

monthlyFacilityAggregation.push(
  ...facilityAggregationData,
  ...monthlyAggregationData,
);

monthlyStateAggregation.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  ...monthlyAggregationData,
);

monthlyNationalAggregation.push(...monthlyAggregationData);

quarterly.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  { ...propertyMetadata.quarter.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);

quarterlyFacilityAggregation.push(
  ...facilityAggregationData,
  ...quarterlyAggregationData,
);

quarterlyStateAggregation.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  ...quarterlyAggregationData,
);

quarterlyNationalAggregation.push(...quarterlyAggregationData)

annual.push(
  ...commonCharacteristics,
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.year.fieldLabels },
  ...commonEmissions,
  ...unitCharacteristics,
  ...controlInfoCharacteristics,
);

annualFacilityAggregation.push(
  ...facilityAggregationData,
  ...annualAggregationData,
);
annualStateAggregation.push(
  { ...propertyMetadata.stateCode.fieldLabels },
  ...annualAggregationData,
);

annualNationalAggregation.push(...annualAggregationData);

ozoneFacilityAggregation.push(
  ...facilityAggregationData,
  ...ozoneAggregationData,
);

hourlyMats.push(
  ...commonCharacteristics,
  ...hourlyCharacteristics,
  { ...propertyMetadata.matsGrossLoad.fieldLabels },
  { ...propertyMetadata.matsHeatInput.fieldLabels },
  { ...propertyMetadata.hgOutputRate.fieldLabels },
  { ...propertyMetadata.hgInputRate.fieldLabels },
  { ...propertyMetadata.hgMass.fieldLabels },
  { ...propertyMetadata.hgMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hclOutputRate.fieldLabels },
  { ...propertyMetadata.hclInputRate.fieldLabels },
  { ...propertyMetadata.hclMass.fieldLabels },
  { ...propertyMetadata.hclMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hfOutputRate.fieldLabels },
  { ...propertyMetadata.hfInputRate.fieldLabels },
  { ...propertyMetadata.hfMass.fieldLabels },
  { ...propertyMetadata.hfMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.associatedStacks.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  ...unitCharacteristics,
  { ...propertyMetadata.so2ControlInfo.fieldLabels },
  { ...propertyMetadata.noxControlInfo.fieldLabels },
  { ...propertyMetadata.pmControlInfo.fieldLabels },
  { ...propertyMetadata.hgControlInfo.fieldLabels },
);

excludableOtherEmissionsColumns.push(
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.countOpTime.fieldLabels },
  { ...propertyMetadata.grossLoad.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.steamLoad.fieldLabels },
  { ...propertyMetadata.sumOpTime.fieldLabels },
  ...unitCharacteristics,
  ...excludableControlInfoCharacteristics,
);

excludableHourlyEmissionsColumns.push(
  { ...propertyMetadata.co2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.co2Rate.fieldLabels },
  { ...propertyMetadata.co2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.grossLoadHourly.fieldLabels },
  { ...propertyMetadata.noxMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.noxRateMeasureFlg.fieldLabels },
  { ...propertyMetadata.opTime.fieldLabels },
  { ...propertyMetadata.so2MassMeasureFlg.fieldLabels },
  { ...propertyMetadata.so2Rate.fieldLabels },
  { ...propertyMetadata.so2RateMeasureFlg.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  ...unitCharacteristics,
  ...excludableControlInfoCharacteristics,
);

excludableHourlyMatsEmissionsColumns.push(
  { ...propertyMetadata.hclInputRate.fieldLabels },
  { ...propertyMetadata.hclMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hclOutputRate.fieldLabels },
  { ...propertyMetadata.hfInputRate.fieldLabels },
  { ...propertyMetadata.hfMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hfOutputRate.fieldLabels },
  { ...propertyMetadata.hgInputRate.fieldLabels },
  { ...propertyMetadata.hgMassMeasureFlg.fieldLabels },
  { ...propertyMetadata.hgOutputRate.fieldLabels },
  { ...propertyMetadata.matsGrossLoad.fieldLabels },
  { ...propertyMetadata.opTime.fieldLabels },
  { ...propertyMetadata.steamLoadHourly.fieldLabels },
  ...unitCharacteristics,
  ...excludableControlInfoCharacteristics,
);

export const fieldMappings = {
  emissions: {
    hourly: {
      data: {
        aggregation: {
          unit: hourly,
          facility: hourlyFacilityAggregation,
          state: hourlyStateAggregation,
          national: hourlyNationalAggregation,
        },
      },
      excludableColumns: excludableHourlyEmissionsColumns,
    },
    daily: {
      data: {
        aggregation: {
          unit: daily,
          facility: dailyFacilityAggregation,
          state: dailyStateAggregation,
          national: dailyNationalAggregation,
        },
      },
      excludableColumns: excludableOtherEmissionsColumns,
    },
    monthly: {
      data: {
        aggregation: {
          unit: monthly,
          facility: monthlyFacilityAggregation,
          state: monthlyStateAggregation,
          national: monthlyNationalAggregation,
        },
      },
      excludableColumns: excludableOtherEmissionsColumns,
    },
    quarterly: {
      data: {
        aggregation: {
          unit: quarterly,
          facility: quarterlyFacilityAggregation,
          state: quarterlyStateAggregation,
          national: quarterlyNationalAggregation,
        },
      },
      excludableColumns: excludableOtherEmissionsColumns,
    },
    annual: {
      data: {
        aggregation: {
          unit: annual,
          facility: annualFacilityAggregation,
          state: annualStateAggregation,
          national: annualNationalAggregation,
        },
      },
      excludableColumns: excludableOtherEmissionsColumns,
    },
    ozone: {
      data: {
        aggregation: {
          unit: annual,
          facility: ozoneFacilityAggregation,
        },
      },
      excludableColumns: excludableOtherEmissionsColumns,
    },
    mats: {
      hourly: {
        data: {
          aggregation: {
            unit: hourlyMats,
          },
        },
        excludableColumns: excludableHourlyMatsEmissionsColumns,
      },
    },
  },
};

export const fieldMappingHeader = 'X-Field-Mappings';
export const excludableColumnHeader = 'X-Excludable-Columns';
