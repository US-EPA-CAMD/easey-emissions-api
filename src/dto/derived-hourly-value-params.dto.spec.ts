import { plainToClass } from 'class-transformer';
import { DerivedHourlyValueParamsDto } from './derived-hourly-value-params.dto';
import { validate } from 'class-validator';
import { genDerivedHourlyValueParamsDto } from '../../test/object-generators/derived-hourly-value';

describe('DerivedHourlyValueParamsDto', () => {
  it('should return no errors for a valid object', async function() {
    const params = genDerivedHourlyValueParamsDto(3);

    for (const param of params) {
      const paramDto = plainToClass(DerivedHourlyValueParamsDto, param);

      const errors = await validate(paramDto);
      expect(errors.length).toBe(0);
    }
  });

  it('should return error messages for missing properties', async function() {
    const params = plainToClass(DerivedHourlyValueParamsDto, {});
    const errors = await validate(params);

    expect(errors.length).toBe(3);
  });
});
