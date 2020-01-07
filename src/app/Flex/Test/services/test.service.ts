import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestService {

  private baseUrl =  environment.baseUrl + '/system/';  // URL to web api

  constructor(private http: HttpClient) { }
  
}
