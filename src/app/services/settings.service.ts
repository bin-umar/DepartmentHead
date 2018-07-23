import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { SettingsResp } from '../models/settings';

@Injectable()
export class SettingsService {

  constructor(private auth: AuthService) { }

  getLoadCoefficients() {
    const body = new HttpParams()
      .set('source', 'loadCfs')
      .set('route', 'settings')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: SettingsResp) => {
        return response;
    });
  }
}
