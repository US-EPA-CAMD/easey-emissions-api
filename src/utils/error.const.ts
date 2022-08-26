// https://ecmps.camdsupport.com/documents/ECMPS%20Import%20Check%20Specifications%202018Q2.pdf
export const IMPORT_CHECK_ERROR = {
  IMPORT_23: {
    RESULT_A() {
      return '[IMPORT-23] You have reported a date in a Daily Summary, DailyTest Summary or Hourly Operating record that does not fall within the reporting period. The emissions file will not be imported.';
    },
  },
  IMPORT_25: {
    RESULT_A(orisCode) {
      return `[IMPORT-25] The database does not contain ORIS Code [${orisCode}]. This file was not imported.`;
    },
  },
};
