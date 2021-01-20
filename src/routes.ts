import { Routes } from "nest-router";

import { HourlyApportionedEmissionsModule } from './hourly-apportioned-emissions/hourly-apportioned-emissions.module';

const routes: Routes = [
  {
    path: '/apportioned/hourly',
    module: HourlyApportionedEmissionsModule,
    // children: [
    //   {
    //     path: ':id/units',
    //     module: UnitsModule,
    //   },
    // ],
  },
];

export default routes;