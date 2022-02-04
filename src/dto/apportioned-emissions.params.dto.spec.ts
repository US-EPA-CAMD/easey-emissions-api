import { validate } from 'class-validator';
import { IsValidNumber } from '@us-epa-camd/easey-common/pipes';

import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

describe('-- Apportioned Emissions Params DTO --', () => {
  describe('getHourlyEmissions with query parameters', () => {
    class MyClass {
      constructor(
        month: string,
      ) {
        this.month = month;
      }
      @IsValidNumber(12)
      @IsInValidReportingQuarter([3, 6, 9], 'year')
      month: string;
    }

    it('should pass all validation pipes', async () => {
      const results = await validate(
        new MyClass(
          '3'
        ),
      );
      expect(results.length).toBe(0);
    });

    it('should fail one of validation pipes (month)', async () => {
      const results = await validate(
        new MyClass(
          'invalid'
        ),
      );
      expect(results.length).toBe(1);
    });
  });
});
