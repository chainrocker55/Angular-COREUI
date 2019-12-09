// Angular

import { NgModule } from '@angular/core';

// Components Routing
import { PMSRoutingModule } from './pms-routing.module';

import { FlexModule } from '../Flex/flex.module';


import { PMS060Component } from './views/PMS060-CheckListAndRepairOrder/PMS060.component';
import { DLG045Component } from './views/DLG045-ItemFindDialogWithParam/DLG045.component';
import { DLGPMS060Component } from './views/DLGPMS060-ScheduleTypeSelect/DLGPMS060.component';
import { DLGPMS062_01Component } from './views/DLGPMS062_01-PartEditor/DLGPMS062_01.component';

@NgModule({
  imports: [
    PMSRoutingModule,
    FlexModule,
  ],
  declarations: [
    PMS060Component,
    DLG045Component,
    DLGPMS060Component,
    DLGPMS062_01Component
  ],
  entryComponents: [
    DLG045Component,
    DLGPMS060Component,
    DLGPMS062_01Component
  ],
})
export class PMSModule { }
