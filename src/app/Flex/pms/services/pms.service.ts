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

    GetCheckJobCr(rowData: PMS060_CheckListAndRepairOrder_Result): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'sp_PMS063_LoadData', rowData);
    }

    GetJobPmChecklist(rowData: PMS060_CheckListAndRepairOrder_Result): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'sp_PMS062_GetJobPmChecklist', rowData);
    }

    SaveOH(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS061_SaveData', data, { responseType: "text" });
    }

    SavePM(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS062_SaveData', data, { responseType: "text" });
    }

    SendToApprovePM(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS062_SendToApprove', data, { responseType: "text" });
    }
    RevisePM(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS062_Revise', data, { responseType: "text" });
    }
    CancelPM(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'PMS062_Cancel', data);
    }

    GetItemFindDialogWithParam(data: any): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'GetItemFindDialogWithParam', data);
    }
    GetInQty(data: any): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'sp_PMS062_GetInQty', data);
    }

    SaveCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_SaveData', data, { responseType: "text" });
    }

    ConfirmCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_Confirm', data, { responseType: "text" });
    }

    SendToApproveCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_SendToApprove', data, { responseType: "text" });
    }

    ApproveCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_Approve', data, { responseType: "text" });
    }

    ReviseCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_Revise', data, { responseType: "text" });
    }

    CancelCR(data: any): Observable<string> {
        return this.http.post(this.baseUrl + 'PMS063_Cancel', data, { responseType: "text" });
    }

    LoadMachineData(machineNo: string): Observable<any> {
        return this.http.post(this.baseUrl + 'LoadMachineData', {StringValue : machineNo} );
    }

    GetCheckJobPersonInCharge(CHECK_REPH_ID: string, MACHINE_NO: string): Observable<any> {
        return this.http.post(this.baseUrl + 'GetCheckJobPersonInCharge', {CHECK_REPH_ID : CHECK_REPH_ID, MACHINE_NO:MACHINE_NO} );
    }

    CancelOH(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'PMS061_Cancel', data);
    }

    
}
