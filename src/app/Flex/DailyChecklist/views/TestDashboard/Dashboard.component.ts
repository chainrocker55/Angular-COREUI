import { Component, OnInit } from '@angular/core';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter } from '@angular/material';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend } from 'ng2-charts';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { DashBoardPieChart } from '../../models/Dashboard_Criteria_Pie';

@Component({
    selector: 'app-dashboard',
    templateUrl: './Dashboard.component.html',
    // styleUrls: ['Dashboard.component.css'],
})
export class Dashboard implements OnInit {

    constructor(
        private svc: PMSDailyChecklistService,
        private flex: FlexService,
        private combo: ComboService,
        private dateAdapter: DateAdapter<any>,
        private dlg: DiaglogService
    ) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }
    ngOnInit(): void {
        this.InitialCombo();
        this.InitialScreen();
        this.InitialCriteria();
        
    }
    criteriaPieChart: DashBoardPieChart = new DashBoardPieChart();
    comboShiftByLine: ComboIntValue[];
    comboLineByLine: ComboIntValue[];

    comboStringAllItem: ComboStringValue = {
        VALUE: '',
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };
    comboIntAllItem: ComboIntValue = {
        VALUE: -1,
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };
    InitialScreen(){
        this.comboStringAllItem.DISPLAY = 'All : - All -';
        this.comboIntAllItem.DISPLAY = 'All : - All -';
    }
    InitialCriteria() {
        this.criteriaPieChart.SHIFTID = -1;
        this.criteriaPieChart.LINEID = -1;;
      
    }

    InitialCombo() {
        this.combo.GetComboShiftTypeDayNight().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboShiftByLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLineCode().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboLineByLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

    }
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    public pieChartLabels: Label[] = [['OK'], ['NG'], 'NOT USED'];
    public pieChartData: SingleDataSet = [30, 50, 20];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];
    public pieChartColors = [
        {
            backgroundColor: ['#1E90FF', 'red', 'black'],

        },
    ];





    typeChart = "Line Chart"

    public barChartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
    };
    public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;


    public barChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'OK', backgroundColor: '#1E90FF',hoverBackgroundColor:'#63c2de' ,hoverBorderColor:'black',hoverBorderWidth:2, },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'NG', backgroundColor: 'red', hoverBackgroundColor: '#f86c6b' ,hoverBorderColor:'black', hoverBorderWidth:2},
        { data: [9, 3, 4, 7, 5, 20, 1], label: 'NOT USED', backgroundColor: 'black', hoverBackgroundColor: '#73818f' ,hoverBorderColor:'black', hoverBorderWidth:2},
    ];
    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        //console.log(event, active);
        // var a = [event,...active]
        // var b = a[1];
        


    }

    // public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //     console.log(event, active);
    // }

    public randomize(): void {
        
        this.typeChart = this.barChartType === 'bar' ? 'Line Chart' : 'Bar Chart';
        this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
    }



}