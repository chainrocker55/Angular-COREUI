// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { TestRoutingModule } from './test-routing.module';

import { FlexModule } from '../Flex/flex.module';
import {Test001Component} from './views/Test-View/Test001.component'
import {DailyChecklistComponent} from './views/DailyChecklist/DailyChecklist.component'
import { DLGPMS151_MachineItem } from './views/DLGPMS151_MachineItem/DLGPMS151_MachineItem.component';

@NgModule({
  imports: [
    TestRoutingModule,
    FlexModule,
   
  ],
  declarations: [
    Test001Component,
    DailyChecklistComponent,
    DLGPMS151_MachineItem
    // FlexCombo,
    // FlexTime,
  ],
  entryComponents: [
    // FlexCombo,
    // FlexTime
    DLGPMS151_MachineItem
  ],
})
export class TestModule { }
