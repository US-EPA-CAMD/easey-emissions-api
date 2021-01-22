import { Validate, validate } from 'class-validator';
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
import { StateValidation } from '../pipes/state-validation.pipe';

describe('-- Hourly Apportioned Emissions Params DTO --', () => {
  describe('* getHourlyEmissions', () => {
    it('tests the validations for the params DTO', async () => {
      class MyClass {
        constructor(
          beginDate: string,
          endDate: string,
          orisCode: string,
          control: string,
          unitType: string,
          unitFuel: string,
          state: string,
        ) {
          this.beginDate = beginDate;
          this.endDate = endDate;
          this.orisCode = orisCode;
          this.control = control;
          this.unitType = unitType;
          this.unitFuel = unitFuel;
          this.state = state;
        }
        @IsInDateRange([new Date('1995-01-01'), new Date()])
        @IsValidDate()
        @IsIsoFormat()
        beginDate: string;

        @IsDateGreaterThanEqualTo('beginDate')
        @IsInDateRange([new Date('1995-01-01'), new Date()])
        @IsValidDate()
        @IsIsoFormat()
        endDate: string;

        @IsOrisCode()
        orisCode: string;

        @IsControlTechnology()
        control: string;

        @IsUnitType()
        unitType: string;

        @IsUnitFuelType()
        unitFuel: string;

        @Validate(StateValidation)
        state: string;
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

      let results = await validate(
        new MyClass(
          '1990-01-01',
          '2020-01-01',
          '612',
          'control',
          'unitType',
          'unitFuel',
          'state',
        ),
      );
      results = await validate(
        new MyClass(
          '2020-02-31',
          '2020-03-01',
          '612',
          'control',
          'unitType',
          'unitFuel',
          'state',
        ),
      );
      fakeManager.findOne.resolves(null);
      results = await validate(
        new MyClass(
          null,
          'error',
          '612',
          'control',
          'unitType',
          'unitFuel',
          'state',
        ),
      );
      expect(results.length).toBeGreaterThan(0);
      mock.close;
    });
  });
});
