import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueController } from './derived-hourly-value.controller';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import {
  genDerivedHourlyValueParamsDto,
  genDerivedHrlyValues,
} from '../../test/object-generators/derived-hourly-value';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

describe('DerivedHourlyValueController', () => {
  let controller: DerivedHourlyValueController;
  let map: DerivedHourlyValueMap;
  let exportModule: typeof import('../derived-hourly-value-functions/derived-hourly-value-export');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueService,
        DerivedHourlyValueMap,
        DerivedHourlyValueRepository,
      ],
      controllers: [DerivedHourlyValueController],
    }).compile();

    controller = module.get<DerivedHourlyValueController>(
      DerivedHourlyValueController,
    );
    map = module.get(DerivedHourlyValueMap);
    exportModule = await import(
      '../derived-hourly-value-functions/derived-hourly-value-export'
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return mapped derived hourly values', async function() {
    const mockedHourlyOpData = genDerivedHrlyValues<DerivedHrlyValue>(3);
    const mapped = await map.many(mockedHourlyOpData);
    jest
      .spyOn(exportModule, 'exportSupplementaryDerivedHourlyValuesQuery')
      .mockResolvedValue(mockedHourlyOpData);

    await expect(
      controller.supplementaryExport(genDerivedHourlyValueParamsDto()[0]),
    ).resolves.toEqual(mapped);
  });
});
