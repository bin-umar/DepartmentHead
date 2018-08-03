import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PrintInfoResp, ResponseExtractionSubject } from '../models/curriculum';
import { ITeacher } from '../models/load';

@Injectable()
export class ExtractionService {

  constructor(private auth: AuthService) { }

  getSubjectsByExtractionId(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'exsubjects')
      .set('operation', 'one')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ResponseExtractionSubject) => {
      return response;
    }));
  }

  getPrintInfo (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'extractions')
      .set('operation', 'custom')
      .set('action', 'printInfo')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: PrintInfoResp) => {
      return response;
    }));
  }

  getTeachersByKf (kfId: number) {
    const body = new HttpParams()
      .set('kf_id', kfId.toString())
      .set('route', 'teachers')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ITeacher) => {
      return response;
    }));
  }
}
