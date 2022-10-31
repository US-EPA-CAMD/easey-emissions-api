import { genHourlyOperatingParamsDto } from '../../test/object-generators/hourly-operating-dto';
import { plainToClass } from 'class-transformer';
import { HourlyOperatingParamsDto } from './hourly-operating.params.dto';
import { validate } from 'class-validator';

describe('HourlyOperatingParamsDto', () => {
  it('should return no errors for a valid object', async function() {
    const params = genHourlyOperatingParamsDto(3);

    for (const param of params) {
      const paramDto = plainToClass(HourlyOperatingParamsDto, param);

      const errors = await validate(paramDto);
      expect(errors.length).toBe(0);
    }
  });

  it('should return error messages for missing properties', async function() {
    const params = plainToClass(HourlyOperatingParamsDto, {});
    const errors = await validate(params);

    expect(errors.length).toBe(3);
  });
});
