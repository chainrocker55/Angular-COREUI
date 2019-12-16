import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PMS060_Search_Criteria } from '../models/PMS060_Search_Criteria';
import { PMS060_CheckListAndRepairOrder_Result } from '../models/PMS060_CheckListAndRepairOrder_Result';
import { PMS062_GetJobPmChecklist_Result } from '../models/PMS062_GetJobPmChecklist_Result';
import { PMS060_UserDefaultValue } from '../models/PMS060_UserDefaultValue';

@Injectable({ providedIn: 'root' })
export class PMSService {

    private baseUrl = environment.baseUrl + '/pms/';  // URL to web api

    constructor(private http: HttpClient) {
    }

    GetCheckListAndRepairOrderList(criteria: PMS060_Search_Criteria): Observable<PMS060_CheckListAndRepairOrder_Result[]> {
        return this.http.post<PMS060_CheckListAndRepairOrder_Result[]>(this.baseUrl + 'sp_PMS060_GetMachineRepairOrderList', criteria);
    }

    PMS060_GetUserDefaultValue(USER_CD: string): Observable<PMS060_UserDefaultValue> {
        return this.http.post<PMS060_UserDefaultValue>(this.baseUrl + 'PMS060_GetUserDefaultValue', { 'StringValue': USER_CD });
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

    GetJobPmChecklist(CHECK_REPH_ID: string, MACHINE_NO: string): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'sp_PMS062_GetJobPmChecklist', { CHECK_REPH_ID: CHECK_REPH_ID, MACHINE_NO: MACHINE_NO });
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

    GetInQty_CR(data: any): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'sp_PMS063_GetInQty', data);
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
        return this.http.post(this.baseUrl + 'LoadMachineData', { StringValue: machineNo });
    }

    GetCheckJobPersonInCharge(CHECK_REPH_ID: string, MACHINE_NO: string): Observable<any> {
        return this.http.post(this.baseUrl + 'GetCheckJobPersonInCharge', { CHECK_REPH_ID: CHECK_REPH_ID, MACHINE_NO: MACHINE_NO });
    }

    CancelOH(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'PMS061_Cancel', data);
    }

    GetMachineDefaultComponent(data: string): Observable<string> {
        return this.http.post(this.baseUrl + 'GetMachineDefaultComponent', { StringValue: data }, { responseType: "text" });
    }

    LoadApproveHistory(CHECK_REPH_ID: string): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'LoadApproveHistory', { StringValue: CHECK_REPH_ID });

    }

    IsApprover(CHECK_REPH_ID: any, USER_CD: string): Observable<string> {
        return this.http.post(this.baseUrl + 'IsApprover', { CHECK_REPH_ID: CHECK_REPH_ID, USER_CD: USER_CD }, { responseType: "text" });

    }

    LoadMachineAttachment(MACHINE_NO: string): Observable<any[]> {
        return this.http.post<any[]>(this.baseUrl + 'LoadMachineAttachment', { StringValue: MACHINE_NO });

    }

    DownloadAttachment(FILEHID: any, FILEID: any) {
        if (!FILEHID)
            FILEHID = "0";

        if (!FILEID)
            FILEID = "0";
        let url = environment.baseUrl + '/file/' + 'DownloadAttachment/' + FILEHID + "/" + FILEID;
        return url;
    }



}
