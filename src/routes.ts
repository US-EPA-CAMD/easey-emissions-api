import { Routes } from 'nest-router';

import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';
import { HourlyApportionedEmissionsModule } from './hourly-apportioned-emissions/hourly-apportioned-emissions.module';

const routes: Routes = [
  {
    path: '/apportioned',
    module: ApportionedEmissionsModule,
    children: [
      {
        path: '/hourly',
        module: HourlyApportionedEmissionsModule,
      },
    ],
  },
];

export default routes;
