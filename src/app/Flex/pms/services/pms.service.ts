import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PMS060_Search_Criteria } from '../models/PMS060_Search_Criteria';
import { PMS060_CheckListAndRepairOrder_Result } from '../models/PMS060_CheckListAndRepairOrder_Result';
import { PMS062_GetJobPmChecklist_Result } from '../models/PMS062_GetJobPmChecklist_Result';

@Injectable({ providedIn: 'root' })
export class PMSService {

    private baseUrl = environment.baseUrl + '/pms/';  // URL to web api

    constructor(private http: HttpClient) {
    }

    GetCheckListAndRepairOrderList(criteria: PMS060_Search_Criteria): Observable<PMS060_CheckListAndRepairOrder_Result[]> {
        return this.http.post<PMS060_CheckListAndRepairOrder_Result[]>(this.baseUrl + 'sp_PMS060_GetMachineRepairOrderList', criteria);
    }

    GetComponentParts(mcbom_cd: string, parts_loc_cd: string): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'sp_PMS062_GetJobPmPart', { "MCBOM_CD": mcbom_cd, "PARTS_LOC_CD": parts_loc_cd });
    }


    GetCheckJob(rowData: PMS060_CheckListAndRepairOrder_Result): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'sp_PMS061_GetCheckJob', rowData);
    }

    GetJobPmChecklist(rowData: PMS060_CheckListAndRepairOrder_Result): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'sp_PMS062_GetJobPmChecklist', rowData);
    }

    SaveOH(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS061_SaveData', data, { responseType: "text" });
    }

    SavePM(data: any): Observable<string> {
        console.log(data);
        return this.http.post(this.baseUrl + 'PMS062_SaveData', data, { responseType: "text" });
    }

    GetItemFindDialogWithParam(data: any): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'GetItemFindDialogWithParam', data);
    }
    GetInQty(data: any): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'sp_PMS062_GetInQty', data);
    }
}
