import { Routes } from 'nest-router';

import { EmissionsModule } from './emissions/emissions.module';
import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';
import { HourlyApportionedEmissionsModule } from './apportioned-emissions/hourly/hourly-apportioned-emissions.module';
import { DailyApportionedEmissionsModule } from './apportioned-emissions/daily/daily-apportioned-emissions.module';
import { MonthlyApportionedEmissionsModule } from './apportioned-emissions/monthly/monthly-apportioned-emissions.module';
import { QuarterlyApportionedEmissionsModule } from './apportioned-emissions/quarterly/quarterly-apportioned-emissions.module';
import { AnnualApportionedEmissionsModule } from './apportioned-emissions/annual/annual-apportioned-emissions.module';
import { OzoneApportionedEmissionsModule } from './apportioned-emissions/ozone/ozone-apportioned-emissions.module';

const routes: Routes = [
  {
    path: '/apportioned',
    module: ApportionedEmissionsModule,
    children: [
      {
        path: '/hourly',
        module: HourlyApportionedEmissionsModule,
      },
      {
        path: '/daily',
        module: DailyApportionedEmissionsModule,
      },
      {
        path: '/monthly',
        module: MonthlyApportionedEmissionsModule,
      },
      {
        path: '/quarterly',
        module: QuarterlyApportionedEmissionsModule,
      },
      {
        path: '/annual',
        module: AnnualApportionedEmissionsModule,
      },
      {
        path: '/ozone',
        module: OzoneApportionedEmissionsModule,
      },
    ],
  },
  {
    path: '/emissions',
    module: EmissionsModule,
  }
];

export default routes;
