import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceController } from './emissions-view.controller';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceService } from './emissions-view.service';

describe('EmissionsViewWorkspaceController', () => {
  let emissionsViewController: EmissionsViewWorkspaceController;
  let emissionsViewService: EmissionsViewWorkspaceService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EmissionsViewWorkspaceRepository,
        EmissionsViewWorkspaceController,
        EmissionsViewWorkspaceService,
        EntityManager,
        ConfigService,
      ],
    }).compile();

    emissionsViewController = module.get(EmissionsViewWorkspaceController);
    emissionsViewService = module.get(EmissionsViewWorkspaceService);
  });

  it('should get available views', async function() {
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
