import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams} from '@angular/common/http';

import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';
import { ILoadKaf } from '../models/load-kaf';
import { ICoefficient } from '../models/settings';

@Injectable()
export class LoadKafService {

  coefs: ICoefficient;
  constructor(private auth: AuthService,
              private stService: SettingsService) {
    this.coefs = this.stService.coefs;
  }

  public getLoadKafReport(kf_id: number) {
    const body = new HttpParams()
      .set('kf_id', kf_id.toString())
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }
}
