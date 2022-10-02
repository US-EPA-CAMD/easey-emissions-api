import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QuarterUnitDataView } from '../../entities/vw-quarter-unit-data.entity';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { PaginatedQuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { HourlyFuelFlowService } from '../../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from '../../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowRepository } from '../../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../../maps/hourly-parameter-fuel-flow.map';

const mockRepository = () => ({
  getEmissions: jest.fn(),
  getEmissionsFacilityAggregation: jest.fn(),
  getEmissionsStateAggregation: jest.fn(),
  getEmissionsNationalAggregation: jest.fn(),
});

const mockRequest = () => {
  return {
    headers: {
      accept: '',
    },
    res: {
      setHeader: jest.fn(),
    },
    on: jest.fn(),
  };
};

describe('-- Quarterly Apportioned Emissions Service --', () => {
  let service: QuarterlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        QuarterlyApportionedEmissionsService,
        HourlyFuelFlowService,
        HourlyFuelFlowRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowRepository,
        HourlyParameterFuelFlowMap,
        {
          provide: QuarterUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(QuarterlyApportionedEmissionsService);
    repository = module.get(QuarterUnitDataRepository);
  });

  describe('getEmissions', () => {
    it('calls QuarterUnitDataRepository.getEmissions() and gets all emissions from the repository', async () => {
      const expected = QuarterUnitDataView[0];
      repository.getEmissions.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissions(req, filters);
      expect(result).toEqual(expected);
    });

    describe('getEmissionsFacilityAggregation', () => {
      it('calls AnnualUnitDataRepository.getEmissionsFacilityAggregation() and gets all emissions from the repository', async () => {
        const expected = [{ quarter: 1 }];
        repository.getEmissionsFacilityAggregation.mockResolvedValue(expected);
        const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
        const result = await service.getEmissionsFacilityAggregation(
          req,
          filters,
        );
        expect(result).toEqual(expected);
      });
    });
  });

  describe('getEmissionsStateAggregation', () => {
    it('calls QuarterUnitDataRepository.getEmissionsStateAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ quarter: 1 }];
      repository.getEmissionsStateAggregation.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissionsStateAggregation(req, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('getEmissionsNationalAggregation', () => {
    it('calls QuarterUnitDataRepository.getEmissionsNationalAggregation() and gets all emissions from the repository', async () => {
      const expected = [{ quarter: 1 }];
      repository.getEmissionsNationalAggregation.mockResolvedValue(expected);
      const filters = new PaginatedQuarterlyApportionedEmissionsParamsDTO();
      const result = await service.getEmissionsNationalAggregation(
        req,
        filters,
      );
      expect(result).toEqual(expected);
    });
  });
});
