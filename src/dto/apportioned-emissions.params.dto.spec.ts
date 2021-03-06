import { IsDefined, validate } from 'class-validator';
import * as typeorm from 'typeorm';
import { createSandbox, SinonSandbox, createStubInstance } from 'sinon';

import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';
import { IsControlTechnology } from '../pipes/is-control-technology.pipe';
import { IsUnitType } from '../pipes/is-unit-type.pipe';
import { IsUnitFuelType } from '../pipes/is-unit-fuel-type.pipe';
import { IsStateCode } from '../pipes/is-state-code.pipe';
import { IsProgram } from '../pipes/is-program.pipe';
import { IsYearFormat } from '../pipes/is-year-format.pipe';
import { IsValidNumber } from '../pipes/is-valid-number.pipe';
import { IsInValidReportingQuarter } from '../pipes/is-in-valid-reporting-quarter.pipe';

describe('-- Apportioned Emissions Params DTO --', () => {
  describe('getHourlyEmissions with query parameters', () => {
    class MyClass {
      constructor(
        beginDate: string,
        endDate: string,
        year: string,
        month: string,
        orisCode: string,
        control: string,
        unitType: string,
        unitFuel: string,
        state: string,
        program: string,
      ) {
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.year = year;
        this.month = month;
        this.orisCode = orisCode;
        this.control = control;
        this.unitType = unitType;
        this.unitFuel = unitFuel;
        this.state = state;
        this.program = program;
      }
      @IsInDateRange([new Date('1995-01-01'), new Date()], false, true, false)
      @IsValidDate()
      @IsIsoFormat()
      @IsDefined()
      beginDate: string;

      @IsDateGreaterThanEqualTo('beginDate')
      @IsInDateRange([new Date('1995-01-01'), new Date()], false, true, false)
      @IsValidDate()
      @IsIsoFormat()
      @IsDefined()
      endDate: string;

      @IsInDateRange([new Date(1995, 0), new Date()], true, true, true)
      @IsYearFormat()
      year: string;

      @IsValidNumber(4)
      @IsInValidReportingQuarter([1, 2, 3], 'year')
      quarter: string;

      @IsValidNumber(12)
      @IsInValidReportingQuarter([3, 6, 9], 'year')
      month: string;

      @IsOrisCode()
      orisCode: string;

      @IsControlTechnology()
      control: string;

      @IsUnitType()
      unitType: string;

      @IsUnitFuelType()
      unitFuel: string;

      @IsStateCode()
      state: string;

      @IsProgram(['MATS'])
      program: string;
    }

    /**
     * This class is used to mock EntityManager and ConnectionManager
     */
    class Mock {
      sandbox: SinonSandbox;
      constructor(method: string | any, fakeData: any, args?: any) {
        this.sandbox = createSandbox();
        if (args) {
          this.sandbox
            .stub(typeorm, method)
            .withArgs(args)
            .returns(fakeData);
        } else {
          this.sandbox.stub(typeorm, method).returns(fakeData);
        }
      }
      close() {
        this.sandbox.restore();
      }
    }
    let mock: Mock;
    const fakeManager = createStubInstance(typeorm.EntityManager);
    fakeManager.findOne.resolves(['value']);
    mock = new Mock('getManager', fakeManager);

    it('should pass all validation pipes', async () => {
      const results = await validate(
        new MyClass(
          '2019-01-01',
          '2019-01-01',
          '2020',
          '1',
          '612',
          'control',
          'unitType',
          'unitFuel',
          'state',
          'program',
        ),
      );
      expect(results.length).toBe(0);
    });

    it('should fail one of validation pipes (beginDate)', async () => {
      const results = await validate(
        new MyClass(
          '1990-01-01',
          '2020-01-01',
          '2020',
          '1',
          '612',
          'control',
          'unitType',
          'unitFuel',
          'state',
          'program',
        ),
      );
      expect(results.length).toBe(1);
    });

    it('should fail all of the validation pipes', async () => {
      fakeManager.findOne.resolves(null);
      const results = await validate(
        new MyClass(
          null,
          'error',
          null,
          null,
          '0',
          'control',
          'unitType',
          'unitFuel',
          'state',
          'MATS',
        ),
      );
      expect(results.length).toBe(8);
    });
    mock.close;
  });
});
