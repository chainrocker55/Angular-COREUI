import { Component, OnInit } from '@angular/core';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter } from '@angular/material';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend } from 'ng2-charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './Dashboard.component.html',
    // styleUrls: ['Dashboard.component.css'],
  })
export class Dashboard implements OnInit{


    public pieChartOptions: ChartOptions = {
        responsive: true,
      };
      public pieChartLabels: Label[] = [['OK'], ['NG'], 'NOT USED'];
      public pieChartData: SingleDataSet = [30, 50, 20];
      public pieChartType: ChartType = 'pie';
      public pieChartLegend = true;
      public pieChartPlugins = [];
    
    constructor(
        private svc: PMSDailyChecklistService,
        private flex: FlexService,
        private combo: ComboService,
        private dateAdapter: DateAdapter<any>,
    ) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

             
    
}