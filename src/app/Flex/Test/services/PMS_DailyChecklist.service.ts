import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, from } from 'rxjs';
import { PMS150_Search_Criteria } from '../models/PMS150_Search_Criteria';
import { PMS150_GetDailyChecklist_Result } from '../models/PMS150_GetDailyChecklist_Result';
import { PMS151_GetDailyChecklist_Detail } from '../models/PMS151_GetDailyChecklist_Detail';


@Injectable({ providedIn: 'root' })
export class PMSDailyChecklistService {

  private baseUrl =  environment.baseUrl + '/Checklist/';  // URL to web api

  constructor(private http: HttpClient) { }


  GetDailyChecklist(criteria: PMS150_Search_Criteria): Observable<PMS150_GetDailyChecklist_Result[]> {
    return this.http.post<PMS150_GetDailyChecklist_Result[]>(this.baseUrl + 'GetDailyChecklist', criteria);
  }
  GetDailyChecklist_Detail(checklistNo: Number): Observable<PMS151_GetDailyChecklist_Detail[]> {
    return this.http.post<PMS151_GetDailyChecklist_Detail[]>(this.baseUrl + 'GetDailyChecklist_Detail', {IntValue: checklistNo});
  }
}
