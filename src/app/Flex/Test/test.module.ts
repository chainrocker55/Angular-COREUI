// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { TestRoutingModule } from './test-routing.module';

import { FlexModule } from '../Flex/flex.module';
import {Test001Component} from './views/Test-View/Test001.component'
import {DailyChecklistComponent} from './views/DailyChecklist/DailyChecklist.component'

@NgModule({
  imports: [
    TestRoutingModule,
    FlexModule,
   
  ],
  declarations: [
    Test001Component,
    DailyChecklistComponent,
    // FlexCombo,
    // FlexTime,
  ],
  entryComponents: [
    // FlexCombo,
    // FlexTime
  ],
})
export class TestModule { }
