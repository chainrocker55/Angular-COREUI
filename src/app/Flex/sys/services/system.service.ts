import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { NavData } from '../../../_nav';
import { TB_CLASS_LIST_MS } from '../models/tableModel';
import { sp_SFM031_LoadUser_Result } from '../views/SFM030-UserList/sp_SFM031_LoadUser_Result';
import { TZ_USER_MS } from '../../Flex/models/tableModel';

@Injectable({ providedIn: 'root' })
export class SystemService {

  private baseUrl =  environment.baseUrl + '/system/';  // URL to web api

  constructor(private http: HttpClient) { }

  GetClassList(): Observable<TB_CLASS_LIST_MS[]> {
    return this.http.get<TB_CLASS_LIST_MS[]>(this.baseUrl + 'GetClassList');
  }
  SaveClassList(data: TB_CLASS_LIST_MS) {
    return this.http.post(this.baseUrl + 'SaveClassList', data);
  }

  GetUserList(): Observable<TZ_USER_MS[]> {
    return this.http.get<TZ_USER_MS[]>(this.baseUrl + 'GetUserList');
  }
  GetUser(user: TZ_USER_MS): Observable<sp_SFM031_LoadUser_Result> {
    return this.http.post<sp_SFM031_LoadUser_Result>(this.baseUrl + 'GetUser', user);
  }
  SaveUser(user: sp_SFM031_LoadUser_Result): Observable<string> {
    return this.http.post<string>(this.baseUrl + 'SaveUser', user);
  }
}
