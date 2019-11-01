import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TZ_LANG_MS, TZ_USER_GROUP_MS, TZ_MENU_SET_MS, TBM_DIVISION, TBM_POSITION } from '../models/tableModel';
import { ComboStringValue } from '../models/complexModel';

@Injectable({ providedIn: 'root' })
export class ComboService {

  private baseUrl =  environment.baseUrl + '/combo/';

  constructor(private router: Router, private http: HttpClient) {
  }

  GetComboLanguage (): Observable<TZ_LANG_MS[]> {
      return this.http.get<TZ_LANG_MS[]>(this.baseUrl + 'GetLanguage');
  }

  GetComboUserGroup (): Observable<TZ_USER_GROUP_MS[]> {
    return this.http.get<TZ_USER_GROUP_MS[]>(this.baseUrl + 'GetUserGroup');
  }

  GetComboMenuSet (): Observable<TZ_MENU_SET_MS[]> {
    return this.http.get<TZ_MENU_SET_MS[]>(this.baseUrl + 'GetMenuSet');
  }

  GetComboDivision (): Observable<TBM_DIVISION[]> {
    return this.http.get<TBM_DIVISION[]>(this.baseUrl + 'GetDivision');
  }

  GetComboPosition (): Observable<TBM_POSITION[]> {
    return this.http.get<TBM_POSITION[]>(this.baseUrl + 'GetPosition');
  }

  GetComboPersonInCharge_KIBUN(): Observable<ComboStringValue[]> {
    return this.http.get<ComboStringValue[]>(this.baseUrl + 'GetComboPersonInCharge_KIBUN');
  }
}
