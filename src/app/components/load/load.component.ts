import {Component, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { LoadService } from '../../services/load.service';
import { DepartmentInfo, Faculty, Kafedra } from '../../models/common';
import { Load, Teacher } from '../../models/load';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css'],
  providers: [ LoadService ],
  encapsulation: ViewEncapsulation.None,
})

export class LoadComponent implements OnInit {

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
  subjects: Load[] = [];
  teachers: Teacher[] = [{
    Id: 0,
    Fio: '',
    Post: '',
    UchStep: '',
    Science_degree: ''
  }];

  arrExSubjects = [];

  constructor(private loadService: LoadService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.kafedra = {
      id: this.depInfo.kf_id,
      fullName: this.depInfo.kafedra,
      shortName: ''
    };

    this.faculty.fullName = this.depInfo.faculty;

    this.loadService.getTeachersByKf(this.kafedra.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(teacher => {
          this.teachers.push({
            Id: +teacher.Id,
            Fio: teacher.Fio,
            Post: teacher.Post,
            UchStep: teacher.UchStep,
            Science_degree: teacher.Science_degree
          });
        });

        this.loadService.getLoadSubjectsByKf(this.kafedra.id).subscribe((response) => {
          if (!response.error) {

            this.subjects = response.data.slice();
            this.subjects.forEach(subject => {

              subject.newId = subject.idExSubject + subject.group;
              subject.degree = this.authService.DEGREES[+subject.degree];
              subject.type = this.authService.TYPES[+subject.type];
              subject.idTeacher = this.teachers.find(x => +x.Id === +subject.idTeacher).Fio;
              subject.isTeacherSaved = !(subject.idTeacher === '');

            });

            const lections = this.subjects.filter(x => x.section === 'Лексия');
            lections.forEach(item => {

              if (+item.idGroup > 0) {

                const mainSb = this.subjects.find(x => +x.id === +item.idGroup);
                this.subjects.filter(x =>
                  x.newId === item.newId && +x.id !== +item.id
                ).forEach(x => {
                  x.newId = mainSb.newId;
                  this.arrExSubjects.push(x.newId);
                });

              } else {
                this.arrExSubjects.push(item.newId);
              }

            });

            this.arrExSubjects = Array.from(new Set(this.arrExSubjects));
          }
        });
      }
    });
  }

  findSubjects(id: string) {
    return this.subjects.filter(x => x.newId === id);
  }

  findFlowedSubject (id: number) {
    return this.subjects.filter(x => +x.idGroup === id);
  }

  getGroups(id: string) {
    const groups = [];
    this.subjects.filter(x => x.newId === id).forEach(item => {
      groups.push(item.group);
    });

    return Array.from(new Set(groups));
  }

  getLection(id: string) {
    const groups = this.getGroups(id);
    let studentsAmount = 0;
    const _subjects = this.subjects.slice();

    groups.forEach(group => {
      studentsAmount += +_subjects.find(x => x.group === group).studentsAmount;
    });

    const _subject = this.subjects.find(x => x.newId === id && x.section === 'Лексия');
    _subject.studentsAmount = studentsAmount;

    return _subject;
  }

  getOtherSectionsByGroup (id: string, group: string) {
    return this.subjects.filter(x =>
      x.newId === id && x.section !== 'Лексия' && x.group === group
    );
  }

  filterFlowedSubjects() {
    const _arrExSubjects = [];

    this.arrExSubjects.forEach(id => {
      const _subject = this.subjects.find(x => (
        x.newId === id && x.section === 'Лексия'
      ));

      if (_subject) {
        if (+_subject.idGroup === 0) { _arrExSubjects.push(id); }
      } else {
        _arrExSubjects.push(id);
      }

    });

    return _arrExSubjects;
  }

  getKafedrasLoadById(filter: { kf: Kafedra, fc: Faculty }) {
    this.faculty = filter.fc;
    this.kafedra = filter.kf;
  }

  connectTeacherWithSubject(teacher: string, idSubject: number) {
    const teacherId = this.teachers.find(x => x.Fio === teacher).Id;

    this.loadService.saveTeacherId(teacherId, idSubject).subscribe(resp => {
      if (!resp.error) {
        this.subjects.find(x => +x.id === idSubject).isTeacherSaved = true;
      }
    });
  }

  deleteTeacherId(idSubject: number) {
    this.loadService.deleteTeacherId(idSubject).subscribe(resp => {
      if (!resp.error) {
        const sb = this.subjects.find(x => +x.id === idSubject);
        sb.isTeacherSaved = false;
        sb.idTeacher = '';
      }
    });
  }
}
