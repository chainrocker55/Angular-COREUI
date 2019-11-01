import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PMS060_Search_Criteria } from '../models/PMS060_Search_Criteria';
import { PMS060_CheckListAndRepairOrder_Result } from '../models/PMS060_CheckListAndRepairOrder_Result';

@Injectable({ providedIn: 'root' })
export class PMSService {

  private baseUrl =  environment.baseUrl + '/pms/';  // URL to web api

  constructor(private http: HttpClient) {
  }

  GetCheckListAndRepairOrderList(criteria: PMS060_Search_Criteria): Observable<PMS060_CheckListAndRepairOrder_Result[]> {
    return this.http.post<PMS060_CheckListAndRepairOrder_Result[]>(this.baseUrl + 'sp_PMS060_GetMachineRepairOrderList', criteria);
  }
  GetCheckJob(rowData: PMS060_CheckListAndRepairOrder_Result): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'sp_PMS061_GetCheckJob', rowData);
  }
}
