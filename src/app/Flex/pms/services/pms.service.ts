import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PMSService {

  private baseUrl =  environment.baseUrl + '/pms/';  // URL to web api

  private criteria = {};

  constructor(private http: HttpClient) {
  }

  GetCheckListAndRepairOrderList(): Observable<any[]> {
    return this.http.post<any[]>(this.baseUrl + 'GetCheckListAndRepairOrderList', this.criteria);
  }
}
