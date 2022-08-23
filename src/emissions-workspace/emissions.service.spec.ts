import { EmissionsWorkspaceService } from './emissions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { EmissionsMap } from '../maps/emissions.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyTestSummaryWorkspaceRepository } from '../daily-test-summary-workspace/daily-test-summary.repository';
import { PlantRepository } from '../plant/plant.repository';
import { MatsDerivedHrlyValueService } from '../mats-derived-hrly-value-workspace/mats-derived-hrly-value.service';
import { MatsDerivedHrlyValueRepository } from '../mats-derived-hrly-value-workspace/mats-derived-hrly-value.repository';

const emissionsWorkspaceRepositoryMock = {
  delete: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
};

describe('Emissions Workspace Service', () => {
  let emissionsService: EmissionsWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmissionsWorkspaceService,
        DailyTestSummaryWorkspaceService,
        DailyCalibrationWorkspaceService,
        EmissionsMap,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        MatsDerivedHrlyValueService,
        {
          provide: PlantRepository,
          useValue: jest.mock('../plant/plant.repository'),
        },
        {
          provide: EmissionsWorkspaceRepository,
          useValue: emissionsWorkspaceRepositoryMock,
        },
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: jest.mock(
            '../daily-test-summary-workspace/daily-test-summary.repository',
          ),
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: jest.mock(
            '../daily-calibration-workspace/daily-calibration.repository',
          ),
        },
        {
          provide: MatsDerivedHrlyValueRepository,
          useValue: () => jest,
        },
      ],
    }).compile();

    emissionsService = module.get(EmissionsWorkspaceService);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(
      emissionsService.delete({ monitorPlanId: '123', reportingPeriodId: 2 }),
    ).resolves.toEqual(undefined);
  });

  it('should sucessfully import', async function() {
    jest.spyOn(emissionsService, 'import').mockResolvedValue(undefined);

    await expect(
      emissionsService.import({
        orisCode: 3,
        year: 2030,
        quarter: 1,
        dailyEmissionData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
      }),
    ).resolves.toEqual(undefined);
  });
});
