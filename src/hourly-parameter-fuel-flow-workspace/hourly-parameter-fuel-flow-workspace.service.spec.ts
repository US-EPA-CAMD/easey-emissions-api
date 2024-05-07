import { Test } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genHourlyParamFuelFlow } from '../../test/object-generators/hourly-param-fuel-flow';
import { HrlyParamFuelFlow } from '../entities/workspace/hrly-param-fuel-flow.entity';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from './hourly-parameter-fuel-flow-workspace.service';

const writeObjectMock = jest.fn();

describe('HourlyParameterFuelFlowWoskpaceService', () => {
  let service: HourlyParameterFuelFlowWorkspaceService;
  let repository: HourlyParameterFuelFlowWorkspaceRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
        HourlyFuelFlowWorkspaceService,
        HourlyFuelFlowWorkspaceRepository,
        HourlyFuelFlowMap,
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
        },
      ],
    }).compile();

    service = module.get(HourlyParameterFuelFlowWorkspaceService);
    repository = module.get(HourlyParameterFuelFlowWorkspaceRepository);
  });

  describe('export', () => {
    it('should return the correct shape of data given correct inputs', async function() {
      const hourlyParams = genHourlyParamFuelFlow<HrlyParamFuelFlow>(3);

      jest.spyOn(repository, 'export').mockResolvedValue(hourlyParams);

      await expect(service.export(['123'])).resolves.toEqual(
        hourlyParams.map(param => {
          return {
            id: param.id,
            userId: param.userId,
            monitoringLocationId: param.monitoringLocationId,
            parameterCode: param.parameterCode,
            parameterValueForFuel: param.parameterValueForFuel,
            formulaId: param.monitorFormula?.formulaId ?? null,
            monitoringFormulaRecordId: param.formulaIdentifier,
            sampleTypeCode: param.sampleTypeCode,
            monitoringSystemId: param.monitorSystem?.monitoringSystemId ?? null,
            operatingConditionCode: param.operatingConditionCode,
            segmentNumber: param.segmentNumber,
            parameterUnitsOfMeasureCode: param.parameterUomCode,
            hourlyFuelFlowId: param.hourlyFuelFlowId,
            calcParamValFuel: param.calcParamValFuel,
            addDate: param.addDate?.toISOString() ?? null,
            updateDate: param.updateDate?.toISOString() ?? null,
            calcAppeStatus: param.calcAppeStatus,
            reportingPeriodId: param.reportingPeriodId,
          };
        }),
      );
    });
  });
  /*
  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new HourlyParamFuelFlowImportDTO(),
        new HourlyParamFuelFlowImportDTO(),
      ];

      await service.import(params, '', '', 1, {
        components: {},
        userId: '',
        monitorFormulas: {},
        monitoringSystems: {},
      });

      expect(writeObjectMock).toHaveBeenCalledTimes(2);
    });
  });
  */
});
