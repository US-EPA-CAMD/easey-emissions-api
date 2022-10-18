import { genSummaryValueParamsDtos } from '../../test/object-generators/summary-value-dto';
import { plainToClass } from 'class-transformer';
import { SummaryValueParamsDto } from './summary-value-params.dto';
import { validate } from 'class-validator';

describe('SummaryValueParamsDto', () => {
  it('should return no errors for a valid object', async function() {
    const params = genSummaryValueParamsDtos()[0];
    const paramsDto = plainToClass(SummaryValueParamsDto, params);

    for (const paramsDtoKey in paramsDto) {
      if (!Array.isArray(paramsDto[paramsDtoKey])) {
        paramsDto[paramsDtoKey] = String(paramsDto[paramsDtoKey]);
      }
    }

    const errors = await validate(paramsDto);
    expect(errors.length).toBe(0);
  });

  it('should return an error message for missing properties', async function() {
    const paramsDto = plainToClass(SummaryValueParamsDto, {});
    const errors = await validate(paramsDto);

    for (const error of errors) {
      if (error.constraints.isArray) {
        expect(error.constraints.isArray).toBe(
          `${error.property} must be an array`,
        );
      }

      if (error.constraints.isNumber) {
        expect(error.constraints.isNumber).toBe(
          `${error.property} must be a number conforming to the specified constraints`,
        );
      }
    }

    expect(errors.length).toBe(5);
  });

  it('should return errors for invalid types', async function() {
    const paramsDto = plainToClass(SummaryValueParamsDto, {
      beginYear: false,
      beginQuarter: {},
      endYear: true,
      endQuarter: [],
    });
    let errors = await validate(paramsDto);

    expect(errors.length).toBe(5);

    paramsDto.beginYear = ('2006' as unknown) as number;
    errors = await validate(paramsDto);
    expect(errors.length).toBe(4);
  });
});
