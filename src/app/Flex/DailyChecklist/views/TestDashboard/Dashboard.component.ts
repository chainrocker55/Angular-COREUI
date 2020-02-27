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
    InitialScreen() {
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
        plugins: {
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        speed: 10,
                        threshold: 10
                    },
                    zoom: {
                        enabled: true,
                        mode: 'y'
                    }
                }
            }
        }
    };

    public barChartLabelsMounth: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    public barChartLabelsDay: Label[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    public barChartLabels: Label[] = this.barChartLabelsMounth;
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;

    // randomArray(length, max):Number[]{
    //     var arr = new Array[length].map(e=>e+1*Math.round(Math.random() * max))

    //     return arr
    // }



    public barChartData1: ChartDataSets[] = [
        { data: this.RandomNumber(12, 80), label: 'OK', backgroundColor: '#1E90FF', hoverBackgroundColor: '#63c2de', hoverBorderColor: 'black', hoverBorderWidth: 2, },
        { data: this.RandomNumber(12, 80), label: 'NG', backgroundColor: 'red', hoverBackgroundColor: '#f86c6b', hoverBorderColor: 'black', hoverBorderWidth: 2 },
        { data: this.RandomNumber(12, 80), label: 'NOT USED', backgroundColor: 'black', hoverBackgroundColor: '#73818f', hoverBorderColor: 'black', hoverBorderWidth: 2 },
    ];
    public barChartData2: ChartDataSets[] = [
        { data: this.RandomNumber(31 ,30), label: 'OK', backgroundColor: '#1E90FF', hoverBackgroundColor: '#63c2de', hoverBorderColor: 'black', hoverBorderWidth: 2, },
        { data: this.RandomNumber(31, 30), label: 'NG', backgroundColor: 'red', hoverBackgroundColor: '#f86c6b', hoverBorderColor: 'black', hoverBorderWidth: 2 },
        { data: this.RandomNumber(31, 30), label: 'NOT USED', backgroundColor: 'black', hoverBackgroundColor: '#73818f', hoverBorderColor: 'black', hoverBorderWidth: 2 },
    ];
    // events
    public barChartData: ChartDataSets[] = this.barChartData1;
    RandomNumber(length, max): number[] {
        var arr = new Array<number>(length)
        for (var i = 0; i < arr.length; i++) {
            arr[i] = Math.round(Math.random() * max)
        }
        return arr
    }

    public chartClicked(e: any): void {

        if (e.active[0] && e.active.length > 0) {
            console.log(e.active[0]._index);
            console.log(this.barChartData === this.barChartData1)
            this.barChartData = this.barChartData === this.barChartData1 ? this.barChartData2 : this.barChartData1
            this.barChartLabels = this.barChartLabels === this.barChartLabelsMounth ? this.barChartLabelsDay : this.barChartLabelsMounth
            //this.barChartData = this.barChartData1

        }
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