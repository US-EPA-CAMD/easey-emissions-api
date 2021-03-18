import { Routes } from 'nest-router';

import { ApportionedEmissionsModule } from './apportioned-emissions/apportioned-emissions.module';

const routes: Routes = [
  {
    path: '/apportioned',
    module: ApportionedEmissionsModule,
  },
];

export default routes;
