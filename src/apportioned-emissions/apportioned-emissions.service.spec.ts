import { Test } from '@nestjs/testing';

import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';

const mockHourUnitDataRepository = () => ({
  getHourlyEmissions: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Apportioned Emissions Service --', () => {
  let apportionedEmissionsService;
  let hourUnitDataRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockHourUnitDataRepository,
        },
        { provide: HourlyApportionedEmissionsMap, useFactory: mockMap },
      ],
    }).compile();

    apportionedEmissionsService = module.get(ApportionedEmissionsService);
    hourUnitDataRepository = module.get(HourUnitDataRepository);
    map = module.get(HourlyApportionedEmissionsMap);
  });

  describe('getHourlyEmissions', () => {
    it('calls HourUnitDataRepository.getHourlyEmissions() and gets all emissions from the repository', async () => {
      hourUnitDataRepository.getHourlyEmissions.mockResolvedValue(
        'list of emissions',
      );
      map.many.mockReturnValue('mapped DTOs');

      let filters = new HourlyApportionedEmissionsParamsDTO();

      let result = await apportionedEmissionsService.getHourlyEmissions(
        filters,
      );

      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mapped DTOs');
    });
  });
});