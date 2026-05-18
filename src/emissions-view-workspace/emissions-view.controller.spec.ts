import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { EntityManager } from 'typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { RolesGuard } from '@us-epa-camd/easey-common/guards';
import { LoggingInterceptor } from '@us-epa-camd/easey-common/interceptors';
import { EmissionsViewParamsDTO } from '../dto/emissions-view.params.dto';
import { EmissionsViewWorkspaceController } from './emissions-view.controller';
import { EmissionsViewWorkspaceRepository } from './emissions-view.repository';
import { EmissionsViewWorkspaceService } from './emissions-view.service';

describe('EmissionsViewWorkspaceController', () => {
  let emissionsViewController: EmissionsViewWorkspaceController;
  let emissionsViewService: EmissionsViewWorkspaceService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        Reflector,
        EmissionsViewWorkspaceRepository,
        EmissionsViewWorkspaceController,
        EmissionsViewWorkspaceService,
        EntityManager,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideInterceptor(LoggingInterceptor)
      .useValue({
        intercept:jest.fn((context, next)=> next.handle()),
      })
    .compile();

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
