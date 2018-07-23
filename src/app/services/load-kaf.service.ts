import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams} from '@angular/common/http';

import { AuthService } from './auth.service';
import { ILoadKaf } from '../models/load-kaf';

@Injectable()
export class LoadKafService {

  constructor(private auth: AuthService) { }

  getLoadKafReport(kf_id: number) {
    const body = new HttpParams()
      .set('kf_id', kf_id.toString())
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ILoadKaf) => {
      return response;
    });
  }
}
