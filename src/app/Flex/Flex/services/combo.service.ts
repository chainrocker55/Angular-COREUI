import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TZ_LANG_MS, TZ_USER_GROUP_MS, TZ_MENU_SET_MS, TBM_DIVISION, TBM_POSITION } from '../models/tableModel';
import { ComboStringValue, ComboIntValue } from '../models/complexModel';

@Injectable({ providedIn: 'root' })
export class ComboService {

  private baseUrl = environment.baseUrl + '/combo/';

  constructor(private router: Router, private http: HttpClient) {
  }

  GetComboLanguage(): Observable<TZ_LANG_MS[]> {
    return this.http.get<TZ_LANG_MS[]>(this.baseUrl + 'GetLanguage');
  }

  GetComboUserGroup(): Observable<TZ_USER_GROUP_MS[]> {
    return this.http.get<TZ_USER_GROUP_MS[]>(this.baseUrl + 'GetUserGroup');
  }

  GetComboMenuSet(): Observable<TZ_MENU_SET_MS[]> {
    return this.http.get<TZ_MENU_SET_MS[]>(this.baseUrl + 'GetMenuSet');
  }

  GetComboDivision(): Observable<TBM_DIVISION[]> {
    return this.http.get<TBM_DIVISION[]>(this.baseUrl + 'GetDivision');
  }

  GetComboPosition(): Observable<TBM_POSITION[]> {
    return this.http.get<TBM_POSITION[]>(this.baseUrl + 'GetPosition');
  }

  GetComboPersonInCharge_KIBUN(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboPersonInCharge_KIBUN');
  }

  GetComboUserWithPosition(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboUserWithPosition');
  }

  GetComboLocation(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboLocation');
  }

  GetComboUserApproveLocation(userCd : string): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboUserApproveLocation/'+ userCd);
  }

  GetComboSupplier(): Observable<ComboIntValue[]> {
    return this.http.get<ComboIntValue[]>(this.baseUrl + 'GetComboSupplier');
  }

  GetComboMachineScheduleType(): Observable<ComboIntValue[]> {
    return this.http.get<ComboIntValue[]>(this.baseUrl + 'GetComboMachineScheduleType');
  }

  GetComboMachineStatus(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboMachineStatus');
  }

  GetComboMachine(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboMachine');
  }

  GetComboPoNumber(): Observable<ComboIntValue[]> {
    return this.http.get<ComboIntValue[]>(this.baseUrl + 'GetComboPoNumber');
  }

  GetComboMachinePeriod(): Observable<ComboIntValue[]> {
    return this.http.get<ComboIntValue[]>(this.baseUrl + 'GetComboMachinePeriod');
  }

  GetComboMachineComponent(machineNo): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboMachineComponent?MACHINE_NO='+machineNo);
  }

  GetComboItemUnit(itemCd): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboItemUnit?ITEM_CD='+itemCd);
  }

  GetComboUnit(showCode): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboUnit?SHOW_CODE='+showCode);
  }
}
