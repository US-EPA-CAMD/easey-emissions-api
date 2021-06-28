import { emissionsFields } from './emissions-fields';

const hourly = [];
const daily = [];
const monthly = [];
const quarterly = [];
const annual = [];

const commonCharacteristics = [
  { ...emissionsFields.state },
  { ...emissionsFields.facilityName },
  { ...emissionsFields.orisCode },
  { ...emissionsFields.unitId },
  { ...emissionsFields.assocStacks },
];

const commonEmissions = [
  { ...emissionsFields.sumOpTime },
  { ...emissionsFields.countOpTime },
  { ...emissionsFields.gload },
  { ...emissionsFields.sload },
  { ...emissionsFields.so2Mass },
  { ...emissionsFields.so2Rate },
  { ...emissionsFields.noxMass },
  { ...emissionsFields.noxRate },
  { ...emissionsFields.co2Mass },
  { ...emissionsFields.co2Rate },
  { ...emissionsFields.heatInput },
];

const unitCharacteristics = [
  { ...emissionsFields.primaryFuels },
  { ...emissionsFields.secondaryFuels },
  { ...emissionsFields.unitTypes },
  { ...emissionsFields.so2Controls },
  { ...emissionsFields.pmControls },
  { ...emissionsFields.noxControls },
  { ...emissionsFields.hgControls },
  { ...emissionsFields.programs },
];

hourly.push(
  ...commonCharacteristics,
  { ...emissionsFields.opDate },
  { ...emissionsFields.opHour },
  { ...emissionsFields.opTime },
  { ...emissionsFields.gloadHrly },
  { ...emissionsFields.sloadHrly },
  { ...emissionsFields.so2MassHrly },
  { ...emissionsFields.so2MassMeasureFlg },
  { ...emissionsFields.so2Rate },
  { ...emissionsFields.so2RateMeasureFlg },
  { ...emissionsFields.noxMassHrly },
  { ...emissionsFields.noxMassMeasureFlg },
  { ...emissionsFields.noxRate },
  { ...emissionsFields.noxRateMeasureFlg },
  { ...emissionsFields.co2Mass },
  { ...emissionsFields.co2MassMeasureFlg },
  { ...emissionsFields.co2Rate },
  { ...emissionsFields.co2RateMeasureFlg },
  { ...emissionsFields.heatInput },
  ...unitCharacteristics,
);

daily.push(
  ...commonCharacteristics,
  { ...emissionsFields.opDate },
  ...commonEmissions,
  ...unitCharacteristics,
);
monthly.push(
  ...commonCharacteristics,
  { ...emissionsFields.opYear },
  { ...emissionsFields.opMonth },
  ...commonEmissions,
  ...unitCharacteristics,
);
quarterly.push(
  ...commonCharacteristics,
  { ...emissionsFields.opYear },
  { ...emissionsFields.opQuarter },
  ...commonEmissions,
  ...unitCharacteristics,
);
annual.push(
  ...commonCharacteristics,
  { ...emissionsFields.opYear },
  ...commonEmissions,
  ...unitCharacteristics,
);

export const fieldMappings = {
  emissions: {
    hourly: hourly,
    daily: daily,
    monthly: monthly,
    quarterly: quarterly,
    annual: annual,
    ozone: annual,
  },
};
