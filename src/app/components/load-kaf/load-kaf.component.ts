import { Component, Input, OnInit, Output } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { LoadKafService } from '../../services/load-kaf.service';
import { SettingsService } from '../../services/settings.service';

import { ICoefficient } from '../../models/settings';
import { DepartmentInfo, Faculty, Kafedra, TypesOfStudying} from '../../models/common';
import { ILoadKafSubject, LoadKaf, LoadKafReport } from '../../models/load-kaf';

@Component({
  selector: 'app-load-kaf',
  templateUrl: './load-kaf.component.html',
  styleUrls: ['../extraction/extraction.component.css'],
  providers: [
    LoadKafService,
    SettingsService
  ]
})
export class LoadKafComponent implements OnInit {

  @Output() cmpName: any = 'Сарбории кафедра';
  @Input() depInfo: DepartmentInfo;
  kafedra: Kafedra = {
    id: null,
    shortName: '',
    fullName: ''
  };
  faculty: Faculty = {
    id: null,
    shortName: '',
    fullName: ''
  };

  subjects: ILoadKafSubject[] = [];

  constructor(private auth: AuthService,
              private lkService: LoadKafService,
              private stService: SettingsService) { }

  ngOnInit() {
    this.kafedra = {
      id: this.depInfo.kf_id,
      fullName: this.depInfo.kafedra,
      shortName: ''
    };

    this.faculty.fullName = this.depInfo.faculty;

    this.lkService.getLoadKafReport(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {

        const subjects: LoadKaf[] = resp.data.slice();

        subjects.forEach(subject => {
          subject.newId = subject.idExSubject + subject.group;
          subject.degree = this.auth.DEGREES[+subject.degree];
        });

        this.stService.getLoadCoefficients().subscribe(response => {
          if (!response.error) {

            const coefs = new ICoefficient(response.data);
            const loadKafReport = new LoadKafReport(subjects, coefs);
            this.subjects = loadKafReport.getSubjects();
          }
        });
      }
    });
  }

  rowAmount(amount: number): number[] {
    return Array.from(Array(amount).keys());
  }

  getSubjects(term: number, type: number, fcId: number): ILoadKafSubject[] {
    return this.subjects.filter(o => (
      o.term === term && +o.type === type && +o.fcId === fcId
    ));
  }

  getTypesByTerm(term: number): TypesOfStudying[] {
    const types: TypesOfStudying[] = [];

    this.subjects.filter(o => o.term === term)
      .forEach(o => {
      const i = types.findIndex(t => t.id === +o.type);
      if (i === -1) {
        types.push(this.auth.TYPES.find(t => t.id === +o.type));
      }
    });

    return types;
  }

  getFacultiesByTerm(term: number): Faculty[] {
    const faculties: Faculty[] = [];

    this.subjects.filter(o => o.term === term)
      .forEach(o => {
        const i = faculties.findIndex(fc => fc.id === +o.fcId);
        if (i === -1) {
          faculties.push({
            id: +o.fcId,
            shortName: o.fcName,
            fullName: o.fcName
          });
        }
      });

    return faculties;
  }

  sum(prop: string, term?: number, type?: number) {
    let sum = 0;
    let subjects: ILoadKafSubject[];

    if (term) {
      if (type) {
        subjects = this.subjects.filter(o => +o.type === type && +o.term === term);
      } else {
        subjects = this.subjects.filter(o => +o.term === term);
      }
    } else {
      subjects = this.subjects;
    }

    subjects.forEach(item => {
      switch (prop) {
        case 'lkTotal': sum += +item.lecture.total; break;
        case 'lbTotal': sum += +item.laboratory.total; break;
        case 'prTotal': sum += +item.practical.total; break;
        case 'smTotal': sum += +item.seminar.total; break;
        case 'advice': sum += +item.advice; break;
        case 'prac': sum += +item.practices; break;
        case 'diploma': sum += +item.diploma; break;
        case 'gosExam': sum += +item.gosExam; break;
        case 'total': sum += +item.total; break;
        case 'cw': sum += +item.courseWork; break;
        case 'cp': sum += +item.courseProject; break;
        case 'wk': sum += +item.workKont; break;
        case 'exam': sum += +item.exam; break;
        case 'tAH': sum += +item.totalAuditHour; break;
      }
    });

    return +sum.toFixed(2);
  }
}
