import { Test, TestingModule } from '@nestjs/testing';
import { SummaryValueController } from './summary-value.controller';
import { SummaryValueRepository } from './summary-value.repository';
import { SummaryValueService } from './summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { SummaryValue } from '../entities/summary-value.entity';
import { genSummaryValueParamsDtos } from '../../test/object-generators/summary-value-dto';

describe('SummaryValueController', () => {
  let controller: SummaryValueController;
  let map: SummaryValueMap;
  let exportModule: typeof import('../summary-value-functions/summary-value-export');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryValueController],
      providers: [SummaryValueService, SummaryValueMap, SummaryValueRepository],
      exports: [SummaryValueService, SummaryValueMap],
    }).compile();

    controller = module.get<SummaryValueController>(SummaryValueController);
    map = module.get(SummaryValueMap);
    exportModule = await import(
      '../summary-value-functions/summary-value-export'
    );
  });

  it('should return mapped summary value data', async function() {
    const mockedSummaryValues = genSummaryValue<SummaryValue>();
    const mapped = await map.many(mockedSummaryValues);
    jest
      .spyOn(exportModule, 'exportSupplementarySummaryValuesQuery')
      .mockResolvedValue(mockedSummaryValues);

    await expect(
      controller.supplementaryExport(genSummaryValueParamsDtos()[0]),
    ).resolves.toEqual(mapped);
  });
});
