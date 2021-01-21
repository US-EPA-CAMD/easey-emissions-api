import { Test } from '@nestjs/testing';

import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { UnitType } from '../enums/unit-type.enum';
import { State } from '../enums/state.enum';
import { IsIsoFormat } from '../pipes/is-iso-format.pipe';
import { IsEmpty, IsNumber, validate, validateOrReject, Validator } from 'class-validator';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidDate } from '../pipes/is-valid-date.pipe';
import { IsOrisCode } from '../pipes/is-oris-code.pipe';
import { stringify } from 'querystring';
import { IsDateGreaterThanEqualTo } from '../pipes/is-date-greater.pipe';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly Apportioned Emissions Controller --', () => {
  let hourlyApportionedEmissionsController: HourlyApportionedEmissionsController;
  let hourlyApportionedEmissionsService: HourlyApportionedEmissionsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [HourlyApportionedEmissionsController],
      providers: [
        HourlyApportionedEmissionsMap,
        HourlyApportionedEmissionsService,
        HourUnitDataRepository,
      ],
    }).compile();

    hourlyApportionedEmissionsController = module.get(
      HourlyApportionedEmissionsController,
    );
    hourlyApportionedEmissionsService = module.get(
      HourlyApportionedEmissionsService,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getHourlyEmissions', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should return test 1', async () => {
      const expectedResult: HourlyApportionedEmissionsDTO[] = [];
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(hourlyApportionedEmissionsService, 'getHourlyEmissions')
        .mockResolvedValue(expectedResult);
      expect(
        await hourlyApportionedEmissionsController.getHourlyEmissions(
          paramsDto,
          req,
        ),
      ).toBe(expectedResult);
    });

    it('tests the date and orisCode validations', async () => {
      class MyClass {
        constructor(beginDate: string, endDate: string, orisCode: string) {
          this.beginDate = beginDate;
          this.endDate = endDate;
          this.orisCode = orisCode;
        }
        @IsInDateRange([new Date('1995-01-01'), (new Date())])
        @IsValidDate()
        @IsIsoFormat()
        beginDate: string;

        @IsDateGreaterThanEqualTo('beginDate')
        @IsInDateRange([new Date('1995-01-01'), (new Date())])
        @IsValidDate()
        @IsIsoFormat()
        endDate: string;

        @IsOrisCode()
        orisCode: string;
      }
      let results = await validate(new MyClass('1990-01-01', '2020-01-01', '612'));
      results = await validate(new MyClass('2020-02-31', '2020-03-01', '612'));
      results = await validate(new MyClass(null, 'error', '612'));
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
