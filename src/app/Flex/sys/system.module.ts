// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { SystemRoutingModule } from './system-routing.module';

import { FlexModule } from '../Flex/flex.module';

import { SFM030Component } from './views/SFM030-UserList/SFM030.component';
import { MAS090Component } from './views/MAS090-ClassList/MAS090.component';
import { SFM0035Component } from './views/SFM0035-UserProfile/SFM0035.component';

@NgModule({
  imports: [
    SystemRoutingModule,
    FlexModule,
  ],
  declarations: [
    SFM030Component,
    MAS090Component,
    SFM0035Component,
  ],
})
export class SystemModule { }
