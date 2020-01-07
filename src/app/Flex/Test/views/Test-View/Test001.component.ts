import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { TZ_USER_GROUP_MS } from '../../../Flex/models/tableModel';
import { FlexService } from '../../../Flex/services/flex.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-sfm006',
  templateUrl: './Test001.component.html',
  styleUrls: ['Test001.component.css'],
})

export class Test001Component implements OnInit {

  obj: any;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(private svc: TestService, private dlg: DiaglogService, private flex: FlexService) {
    this.obj = {};

  }


  ngOnInit() {
    this.LoadData();
    // console.log(this.flex.ActivePermission('BMM011'));
    console.log("OnInit");
  }

  LoadData() {
    console.log("Load Data");
  }

  OnEdit(data: TZ_USER_GROUP_MS) {
    console.log("Edit Data");
    // if (!data) { return; }
    // if (this.obj.SelectedData && data.GROUP_CD === this.obj.SelectedData.GROUP_CD) { return; }

    // this.obj.SelectedData = data;
    // this.svc.sp_SFM0061_GetPermission(data.GROUP_CD).subscribe(res => {
    //     this.obj.Screen = res;
    //     this.obj.SelectedScreen = null;
    // }, error => {
    //     this.dlg.ShowException(error);
    // });
  }
  OnEditScreen(data) {
    console.log("Edit Screen");
    // if (!data) { return; }
    // if (this.obj.SelectedScreen && data.SCREEN_CD === this.obj.SelectedScreen.SCREEN_CD) { return; }

    // this.obj.SelectedScreen = data;
  }
  OnClick(data) {
    console.log("Click Data");
    //   data.CAN_EXECUTE = !data.CAN_EXECUTE;
    //   this.OnChecked(data);
  }
  OnChecked(data) {
    console.log("Check Data");
    //   data.CAN_EXECUTE = data.CAN_EXECUTE === true ? 1 : 0;
    //   data.GROUP_CD = this.obj.SelectedData.GROUP_CD;
    //   this.svc.UpdatePermission(data).subscribe(res => {
    //       this.dlg.ShowProcessComplete();
    //   }, error => {
    //       this.dlg.ShowException(error);
    //   });
  }
}
