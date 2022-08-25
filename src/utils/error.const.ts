// https://ecmps.camdsupport.com/documents/ECMPS%20Import%20Check%20Specifications%202018Q2.pdf
export const IMPORT_CHECK_ERROR = {
  IMPORT_23: {
    RESULT_A() {
      return 'You have reported a date in a Daily Summary, DailyTest Summary or Hourly Operating record that does not fall within the reporting period. The emissions file will not be imported.';
    },
  },
  IMPORT_29: {
    RESULT_A() {
      return '[IMPORT-29] You have reported a Daily Calibration record linked to a test for which the Test Summary TestTypeCode is not "DAYCAL". It is not appropriate to report a Daily Calibration record for a TestTypeCode other than "DAYCAL." This test was not imported.';
    },
  },
  IMPORT_38:{
    RESULT_A(testTypeCode){
      return `[IMPORT-38] You have reported WeeklySystemIntegrity records for a Weekly Test Summary Record with a Test Type Code of [${testTypeCode}]. This File was not imported.`
    }
  }
};
