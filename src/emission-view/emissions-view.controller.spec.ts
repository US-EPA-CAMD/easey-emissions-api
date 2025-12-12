import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewController } from './emissions-view.controller';
import { EmissionsViewRepository } from './emissions-view.repository';
import { EmissionsViewService } from './emissions-view.service';

describe('EmissionsViewController', () => {
  let emissionsViewController: EmissionsViewController;
  let emissionsViewService: EmissionsViewService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmissionsViewRepository,
        EmissionsViewController,
        EmissionsViewService,
        EntityManager,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
      ],
    }).compile();

    emissionsViewController = module.get(EmissionsViewController);
    emissionsViewService = module.get(EmissionsViewService);
  });

  it('should get available views', async function () {
    jest
      .spyOn(emissionsViewService, 'getAvailableViews')
      .mockResolvedValue(undefined);

    await expect(emissionsViewController.getAvailableViews()).resolves.toEqual(
      { "items": undefined },
    );
  });

  it('should get available views', async function () {
    jest.spyOn(emissionsViewService, 'getView').mockResolvedValue(undefined);

    await expect(
      emissionsViewController.getView(
        'code',
        undefined,
        new EmissionsViewParamsDTO(),
      ),
    ).resolves.toEqual(undefined);
  });
});
