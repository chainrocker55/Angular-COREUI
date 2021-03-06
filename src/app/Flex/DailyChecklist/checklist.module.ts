// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { ChecklistRoutingModule } from './checklist-routing.module';

import { FlexModule } from '../Flex/flex.module';
import {DailyChecklistComponent} from './views/DailyChecklist/DailyChecklist.component'
import { DLGPMS151_MachineItem } from './views/DLGPMS151_MachineItem/DLGPMS151_MachineItem.component';
import { DailyChecklistByLineComponent } from './views/DailyChecklistByLine/DailyChecklistByLine.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Dashboard } from './views/TestDashboard/Dashboard.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    ChecklistRoutingModule,
    FlexModule,
    MatTooltipModule,
    MatToolbarModule,
    ChartsModule
   
  ],
  declarations: [
    DailyChecklistComponent,
    DailyChecklistByLineComponent,
    DLGPMS151_MachineItem,
    Dashboard
    // FlexCombo,
    // FlexTime,
  ],
  entryComponents: [
    // FlexCombo,
    // FlexTime
    DLGPMS151_MachineItem,
    
  ],
})
export class ChecklistModule { }
