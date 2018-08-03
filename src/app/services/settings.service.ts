import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { ICoefficient, SettingsResp } from '../models/settings';

@Injectable()
export class SettingsService {

  coefs: ICoefficient;
  constructor(private auth: AuthService) { }

  getLoadCoefficients() {
    const body = new HttpParams()
      .set('source', 'loadCfs')
      .set('route', 'settings')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<SettingsResp>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(resp => {
        if (!resp.error) {
          this.coefs = new ICoefficient(resp.data);
        }
    }, (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }
}
