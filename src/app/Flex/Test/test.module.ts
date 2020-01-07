// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { TestRoutingModule } from './test-routing.module';

import { FlexModule } from '../Flex/flex.module';
import {Test001Component} from './views/Test-View/Test001.component'


@NgModule({
  imports: [
    TestRoutingModule,
    FlexModule,
  ],
  declarations: [
    Test001Component,
  ],
})
export class TestModule { }
