// Angular

import { NgModule } from '@angular/core';

// Components Routing
import { PMSRoutingModule } from './pms-routing.module';

import { FlexModule } from '../Flex/flex.module';

import { PMS060Component } from './views/PMS060-CheckListAndRepairOrder/PMS060.component';

@NgModule({
  imports: [
    PMSRoutingModule,
    FlexModule,
  ],
  declarations: [
    PMS060Component,
  ]
})
export class PMSModule { }
