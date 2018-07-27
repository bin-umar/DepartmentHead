import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { ILoad } from '../models/load';
import { IFaculty, KafedraRes, UpdateResponse } from '../models/common';

@Injectable()
export class LoadService {

  constructor(private auth: AuthService) { }

  getLoadSubjectsByKf (kfId: number) {
    const body = new HttpParams()
      .set('kf_id', kfId.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ILoad) => {
      return response;
    });
  }

  saveTeacherId (idTeacher: number, idSubject: number) {
    const body = new HttpParams()
      .set('idTeacher', idTeacher.toString())
      .set('idSubject', idSubject.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: UpdateResponse) => {
      return response;
    });
  }

  deleteTeacherId (idSubject: number) {
    const body = new HttpParams()
      .set('id', idSubject.toString())
      .set('route', 'ldSubjects')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: UpdateResponse) => {
      return response;
    });
  }

  getFacultyList() {
    const body = new HttpParams()
      .set('route', 'fc')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: IFaculty) => {
      return response;
    });
  }

  getKafedraByFacultyId(fcId: number) {
    const body = new HttpParams()
      .set('id', fcId.toString())
      .set('route', 'kafedra')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: KafedraRes) => {
      return response;
    });
  }
}
