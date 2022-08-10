// import { ConfigService } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { LoggerModule } from '@us-epa-camd/easey-common/logger';
// import { EmissionSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
// import { EmissionController } from './emissions.controller';
// import { EmissionsRepository } from './emissions.repository';
// import { EmissionService } from './emissions.service';

// const mockEmissionsRepository = () => ({
//   getSubmissionProgress: jest.fn(),
// });

// describe('Emissions Controller', () => {
//   let controller: EmissionController;
//   let service: EmissionService;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [LoggerModule],
//       controllers: [EmissionController],
//       providers: [
//         EmissionService,
//         EmissionSubmissionsProgressMap,
//         ConfigService,
//         { provide: EmissionsRepository, useFactory: mockEmissionsRepository },
//       ],
//     }).compile();

//     controller = module.get(EmissionController);
//     service = module.get(EmissionService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('Get Methods', () => {
//     it('should return the provided data', async () => {
//       const data = undefined;

//       jest.spyOn(service, 'getSubmissionProgress').mockResolvedValue(data);

//       expect(
//         await controller.submissionProgress({ submissionPeriod: new Date() }),
//       ).toBe(data);
//     });
//   });
// });
