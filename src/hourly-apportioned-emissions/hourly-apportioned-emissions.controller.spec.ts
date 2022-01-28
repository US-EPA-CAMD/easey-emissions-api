// import { Test } from '@nestjs/testing';
// import { LoggerModule } from '@us-epa-camd/easey-common/logger';

// import { ApportionedEmissionsService } from './hourly-apportioned-emissions.service';
// import { ApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
// import { HourUnitDataRepository } from './hour-unit-data.repository';
// import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
// import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
// import { HourlyApportionedEmissionsParamsDTO } from '../dto/hourly-apportioned-emissions.params.dto';
// import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';
// import { DayUnitDataRepository } from './day-unit-data.repository';
// import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
// import { DailyApportionedEmissionsParamsDTO } from '../dto/daily-apportioned-emissions.params.dto';
// import { MonthlyApportionedEmissionsParamsDTO } from '../dto/monthly-apportioned-emissions.params.dto';
// import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';
// import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
// import { MonthUnitDataRepository } from './month-unit-data.repository';
// import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
// import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
// import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';
// import { QuarterlyApportionedEmissionsParamsDTO } from '../dto/quarterly-apportioned-emissions.params.dto';
// import { AnnualUnitDataRepository } from './annual-unit-data.repository';
// import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';
// import { AnnualApportionedEmissionsParamsDTO } from '../dto/annual-apportioned-emissions.params.dto';
// import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';
// import { OzoneApportionedEmissionsDTO } from '../dto/ozone-apportioned-emissions.dto';
// import { OzoneApportionedEmissionsParamsDTO } from '../dto/ozone-apportioned-emissions.params.dto';
// import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
// import { OzoneApportionedEmissionsMap } from '../maps/ozone-apportioned-emissions.map';

// const mockRequest = (url: string) => {
//   return {
//     url,
//     res: {
//       setHeader: jest.fn(),
//     },
//   };
// };

// describe('-- Apportioned Emissions Controller --', () => {
//   let apportionedEmissionsController: ApportionedEmissionsController;
//   let apportionedEmissionsService: ApportionedEmissionsService;
//   let req: any;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [LoggerModule],
//       controllers: [ApportionedEmissionsController],
//       providers: [
//         HourlyApportionedEmissionsMap,
//         DailyApportionedEmissionsMap,
//         MonthlyApportionedEmissionsMap,
//         QuarterlyApportionedEmissionsMap,
//         AnnualApportionedEmissionsMap,
//         OzoneApportionedEmissionsMap,
//         ApportionedEmissionsService,
//         HourUnitDataRepository,
//         DayUnitDataRepository,
//         MonthUnitDataRepository,
//         QuarterUnitDataRepository,
//         AnnualUnitDataRepository,
//         OzoneUnitDataRepository,
//       ],
//     }).compile();

//     apportionedEmissionsController = module.get(ApportionedEmissionsController);
//     apportionedEmissionsService = module.get(ApportionedEmissionsService);
//     req = mockRequest('');
//     req.res.setHeader.mockReturnValue();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('* getHourlyEmissions', () => {
//     it('should return test 1', async () => {
//       const expectedResult: HourlyApportionedEmissionsDTO[] = [];
//       const paramsDto = new HourlyApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getHourlyEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getHourlyEmissions(paramsDto, req),
//       ).toBe(expectedResult);
//     });
//   });

//   describe('* getDailyEmissions', () => {
//     it('should call the service and return a list of daily emissions', async () => {
//       const expectedResult: DailyApportionedEmissionsDTO[] = [];
//       const paramsDto = new DailyApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getDailyEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getDailyEmissions(paramsDto, req),
//       ).toBe(expectedResult);
//     });
//   });

//   describe('* getMonthlyEmissions', () => {
//     it('should call the service and return a list of monthly emissions', async () => {
//       const expectedResult: MonthlyApportionedEmissionsDTO[] = [];
//       const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getMonthlyEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getMonthlyEmissions(
//           paramsDto,
//           req,
//         ),
//       ).toBe(expectedResult);
//     });
//   });

//   describe('* getQuarterlyEmissions', () => {
//     it('should call the service and return a list of quarterly emissions', async () => {
//       const expectedResult: QuarterlyApportionedEmissionsDTO[] = [];
//       const paramsDto = new QuarterlyApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getQuarterlyEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getQuarterlyEmissions(
//           paramsDto,
//           req,
//         ),
//       ).toBe(expectedResult);
//     });
//   });

//   describe('* getAnnualEmissions', () => {
//     it('should call the service and return a list of annual emissions', async () => {
//       const expectedResult: AnnualApportionedEmissionsDTO[] = [];
//       const paramsDto = new AnnualApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getAnnualEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getAnnualEmissions(paramsDto, req),
//       ).toBe(expectedResult);
//     });
//   });

//   describe('* getOzoneEmissions', () => {
//     it('should call the service and return a list of ozone emissions', async () => {
//       const expectedResult: OzoneApportionedEmissionsDTO[] = [];
//       const paramsDto = new OzoneApportionedEmissionsParamsDTO();
//       jest
//         .spyOn(apportionedEmissionsService, 'getOzoneEmissions')
//         .mockResolvedValue(expectedResult);
//       expect(
//         await apportionedEmissionsController.getOzoneEmissions(paramsDto, req),
//       ).toBe(expectedResult);
//     });
//   });
// });
